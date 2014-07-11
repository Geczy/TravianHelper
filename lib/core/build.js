TravianHelper.Build = function(game) {
    if (!TravianHelper.Utils.URLContains('dorf1.php') && !TravianHelper.Utils.URLContains('dorf2.php') && !TravianHelper.Utils.URLContains('build.php')) {
        return;
    }

    console.log('%c---Begin MasterBuilder', 'background-color: #d9edf7; border-color: #bce8f1; color: #31708f;border: 1px solid transparent;border-radius: 4px;padding:5px;line-height:40px;font-size:12px;text-shadow: 0 0.01px #000;');

    this.game = game;
    this.tasks = this.game.tasks[this.game.currentVillageID];
    this.gid = 0;

    var start = TravianHelper.Utils.startTimer();
    this.initialize();
    TravianHelper.Utils.endTimer('Added master builder queue', start);

    console.log('%c---End MasterBuilder \n', 'background-color: #d9edf7; border-color: #bce8f1; color: #31708f;border: 1px solid transparent;border-radius: 4px;padding:5px;line-height:40px;font-size:12px;text-shadow: 0 0.01px #000;');
}

TravianHelper.Build.prototype = {

    initialize: function() {

        if (TravianHelper.Utils.URLContains('dorf1.php') || TravianHelper.Utils.URLContains('dorf2.php')) {
            if (this.tasks != undefined && this.tasks.length) {
                this.displayList();
                this.handleButton();
                this.saveDoneTime();
            }

            this.waitTask();

        } else if (TravianHelper.Utils.URLContains('build.php') && $('.titleInHeader').text().indexOf('Construct') == -1) {
            this.gid = this.getBuildingGID();
            this.handle_building();

            if ($('.none').text().indexOf('completely extended.') == -1) {
                this.showButton();
                this.handleButton();
            }
        }
    },

    saveDoneTime: function() {
        if (!$('.buildDuration:first').length) {
            return false;
        }

        var nextDone = this.get_done_building_time();
        var currentTime = this.game.get_server_time();

        // If the done date is before the current hour, that means the date is for tomorrow, not today
        if (nextDone.getHours() < currentTime.getHours()) {
            nextDone.setDate(nextDone.getDate() + 1);
        }

        // Add a minute to the finished date just to ensure it's finished
        nextDone.setMinutes(nextDone.getMinutes() + 1)

        this.game.doneTimes[this.game.currentVillageID] = nextDone;
        localStorage.setItem('doneTimes', JSON.stringify(this.game.doneTimes));

        console.log('\tSaved "next tile done at" time: ' + nextDone);
    },

    getBuildingGID: function() {
        var id = 0;
        var classes = $('#build').attr('class').split(' ');
        for (var k in classes) {
            if (classes[k].indexOf('gid') !== -1) {
                tid = parseInt(classes[k].replace('gid', ''));
                if (!isNaN(tid)) {
                    id = tid;
                }
            }
        }

        return id == 0 ? this.game.url.id : id;
    },

    displayList: function() {
        if (!$('.buildingList ul:last').length) {
            var html = '<div class="boxes buildingList"><div class="boxes-tl"></div><div class="boxes-tr"></div><div class="boxes-tc"></div><div class="boxes-ml"></div><div class="boxes-mr"></div><div class="boxes-mc"></div><div class="boxes-bl"></div><div class="boxes-br"></div><div class="boxes-bc"></div><div class="boxes-contents cf"><ul></ul></div></div>';
            var appendTo = TravianHelper.Utils.URLContains('dorf1.php') ? '#village_map' : '.villageMapWrapper';
            $(appendTo).after(html);
        }

        html = '<h5>Master builder: <span>(Costs: <img src="img/x.gif" alt="Gold" class="gold"><span class="goldValue">0</span>)</span></h5>';
        idString = '';
        if (this.tasks != undefined) {
            idString = '<ul>';
            for (var i = 0; i < this.tasks.length; i++) {
                idString += '<li>';
                idString += '<a id="' + this.tasks[i].id + '" class="removeQueue" href="#"><img src="img/x.gif" class="del" alt="cancel"></a>';
                idString += '<div class="name inactive">' + TravianHelper.GameData.gidNames[this.tasks[i].gid] + ' <span class="lvl">Level ' + this.tasks[i].level + '</span></div>';
                idString += '<div class="clear"></div>';
                idString += '</li>';
            };
            idString += '</ul>';
        }

        if (idString.length) {
            html += idString;
            $('.buildingList ul:last').after(html);
        }
    },

    handleButton: function() {
        $('#nextQueue').on('click', $.proxy(function(e) {
            var m = new RegExp('.*?(\\d+)', ["i"]).exec($('.contractText').not('b').text());
            var nextLevel = m != null ? parseInt(m[1]) : -1;

            var count = 0;
            for (key in this.tasks) {
                if (this.tasks[key].id == this.game.url.id) {
                    count++;
                }
            };

            if (nextLevel !== -1) {
                nextLevel += count;
            }

            var nextQueue = {
                id: this.game.url.id,
                gid: this.gid,
                level: nextLevel,
            };

            if (this.tasks == undefined) {
                this.tasks = Array(nextQueue);
            } else {
                this.tasks.push(nextQueue);
            }

            this.game.tasks[this.game.currentVillageID] = this.tasks;
            localStorage.setItem('taskList', JSON.stringify(this.game.tasks));

            var redirTo = this.gid <= 4 ? 'dorf1.php' : 'dorf2.php';
            location.href = redirTo;
            return false;
        }, this));

        $('.removeQueue').on('click', $.proxy(function(e) {
            for (key in this.tasks) {
                if (this.tasks[key].id == $(event.currentTarget).attr('id')) {
                    this.tasks.splice(key, 1);
                    break;
                }
            };


            this.game.tasks[this.game.currentVillageID] = this.tasks;
            localStorage.setItem('taskList', JSON.stringify(this.game.tasks));

            location.reload();
            return false;
        }, this));

    },

    handle_building: function() {

        // If the upgrade button is clicked, we remove it from our task list
        if (!$('.green.build').text().trim()) {
            return false;
        }

        for (key in this.tasks) {
            if (this.tasks[key].id == this.game.url.id) {
                this.tasks.splice(key, 1);

                this.game.tasks[this.game.currentVillageID] = this.tasks;
                localStorage.setItem('taskList', JSON.stringify(this.game.tasks));

                $('.green.build').click();
                break;
            }
        };

    },

    redirectTo: function(id) {
        location.replace('build.php?tt=0&t=0&id=' + id);
    },

    hasResources: function() {
        if (this.tasks == undefined || !this.tasks.length) {
            return false;
        }

        var resources = TravianHelper.Utils.getCurrentResources();
        var buildCount = $('.buildDuration').length;

        // Plus accounts can build two items
        var isBuilding = buildCount > 1 || (buildCount == 1 && !TravianHelper.Utils.hasPlus());

        if (isBuilding) {
            // console.log('\tBuilding queue for this village is full');
            return false;
        }

        var gidString = TravianHelper.Enums.VillageInGID[this.tasks[0].gid];

        // - 1 on the level because .level is the next level, not the current level
        var costToUpgrade = TravianHelper.Enums.Tiles[gidString][this.tasks[0].level - 1];

        for (var i = 0; i < 4; i++) {
            if (resources[i] < costToUpgrade[i]) {
                console.log('\tNot enough resources to upgrade');
                return false;
            }
        }

        return true;
    },

    waitTask: function() {
        if (!this.hasResources()) {
            // Find another village that can build
            var currentTime = this.game.get_server_time();
            var closestTime = 0;
            var closestVillage = 0;
            var closestTimeEnd = 0;
            for (villageID in this.game.doneTimes) {

                // Does the village have tasks that need built?
                if (this.game.tasks[villageID] == undefined || !this.game.tasks[villageID].length) {
                    continue;
                }

                if (!this.game.doneTimes[villageID]) {
                    continue;
                }

                var vilDate = new Date(this.game.doneTimes[villageID]);

                if (closestTime == 0) {
                    closestVillage = villageID;
                    closestTime = vilDate - currentTime;
                    closestTimeEnd = vilDate;
                }

                if ((vilDate - currentTime) < closestTime) {
                    closestTime = vilDate - currentTime;
                    closestVillage = villageID;
                    closestTimeEnd = vilDate;
                }

                if (currentTime > vilDate && villageID != this.game.currentVillageID) {
                    // skip current village to prevent inifinite refreshes
                    // when a resource isnt available for a build
                    // location.href = '?newdid=' + villageID;
                    return;
                }

                // Romans can build a resource + a building at the same time
                if (villageID == this.game.currentVillageID && this.game.tribe == "Romans") {
                    console.log("HBUILD");

                }
            }

            if (closestVillage) {
                console.log('\tChecking building queue for other villages...\n\tSoonest build end time found in village: ' + this.game.villageInfo[closestVillage].name + ' at ' + closestTimeEnd);
            } else {
                console.log('\tChecking building queue for other villages...No tasks found');
            }

            setTimeout($.proxy(this.waitTask, this), 10000);
            return;
        }

        this.redirectTo(this.tasks[0].id);

        return false;
    },

    showButton: function() {
        var m = new RegExp('.*?(\\d+)', ["i"]).exec($('.contractText').not('b').text());
        var nextLevel = m != null ? parseInt(m[1]) : -1;
        var count = 0;
        for (key in this.tasks) {
            if (this.tasks[key].id == this.game.url.id) {
                count++;
            }
        };

        if (nextLevel !== -1) {
            nextLevel += count;
        }

        html = '';
        html += TravianHelper.Display.openHeader();

        html += TravianHelper.Display.createButton('Queue level ' + nextLevel, 'nextQueue');
        html += TravianHelper.Display.closeHeader();

        $('.contractWrapper').after(html);
    },

    get_done_building_time: function() {
        var d = new Date();

        var time = $('.buildDuration:first').text().trim().toLowerCase();
        time = TravianHelper.Utils.allAfter(time, 'at ').replace('at ', '').trim();
        time = time.split(':');

        d.setHours(time[0]);
        d.setMinutes(time[1]);

        return d;
    },

}