TravianHelper.UpgradeCheck = function() {
    if (!TravianHelper.Utils.URLContains('dorf1.php') && !TravianHelper.Utils.URLContains('dorf2.php')) {
        return;
    }

    console.log('---Begin UpgradeCheck')

    var start = TravianHelper.Utils.startTimer();
    this.initialize();
    TravianHelper.Utils.endTimer("Added tile upgrade indicators", start);

    console.log('---End UpgradeCheck \n')
}

TravianHelper.UpgradeCheck.prototype = {
    initialize: function() {
        this.showTips();

        if (TravianHelper.Utils.URLContains(TravianHelper.Enums.Pages.VillageIn)) {
            this.buildings();
        } else {
            this.fields();
        }
    },

    buildings: function() {
        var resources = TravianHelper.Utils.getCurrentResources();

        // Get village levels map
        var villageMap = $("#village_map");
        var tiles = $("img", villageMap).not(".iso, .clickareas, #lswitch, .onTop");

        var resEfficiency = [];
        tiles.each(function(index) {
            var levelObject = $("#levels div", villageMap)[index];
            var underConstruction = $(levelObject).is(".underConstruction");

            if (!$(levelObject).length) {
                return true;
            }

            var match = $(levelObject).attr("class").match(/aid([0-9]{1,2})/);
            if (match.length < 1) {
                return true;
            }

            var id = match[1];
            var gid = $(this).attr("class").match(/g([0-9]{1,2})/)[1];
            var currentLevel = parseInt($(levelObject).text(), 10) || 0;
            currentLevel = underConstruction ? (currentLevel + 1) : currentLevel;
            var tile = TravianHelper.Enums.VillageInGID[gid];
            var upgradeCosts = TravianHelper.Enums.Tiles[tile];
            var costToUpgrade = upgradeCosts[currentLevel];

            // Show upgrade efficiency
            if (costToUpgrade) {
                var total = costToUpgrade[0] + costToUpgrade[1] + costToUpgrade[2] + costToUpgrade[3];
                var rPerWheat = costToUpgrade[4] > 0 ? Math.floor(total / costToUpgrade[4]) : 0;

                if (rPerWheat > 0) {
                    var resEfficiencyit = [rPerWheat, currentLevel, tile, gid];
                    resEfficiency.push(resEfficiencyit);
                }
            }

            if (underConstruction) {
                return true;
            }

            if (currentLevel >= upgradeCosts.length) {
                return true;
            }

            for (var i = 0; i < 4; i++) {
                if (resources[i] < costToUpgrade[i]) {
                    return true;
                }
            }


            // All this should be unnecessary...I had to get the storage item
            // Each time because $(this) can't be used simultaneously as `this`
            // Even using $.proxy
            var taskList = JSON.parse(localStorage.getItem('taskList')) || {};
            var currentVillageID = TravianHelper.Utils.getCurrentVillageID();
            if (taskList[currentVillageID] != undefined && taskList[currentVillageID].length) {
                for (tasks in taskList[currentVillageID]) {
                    if (taskList[currentVillageID][tasks].id == id) {
                        $(levelObject).addClass('underConstruction').text(currentLevel += 1);
                        return true;
                    }
                }
            }

            $(levelObject).css('border-radius', '50%').css('background-color', '#5cb85c').css('background-image', 'none').css('border', '2px solid gray');

        });

        if (resEfficiency.length) {
            resEfficiency.sort(function(a, b) {
                return a[0] - b[0];
            });

            var html = '<ul>'
            for (var i = 0; i < resEfficiency.length; i++) {
                html += '<li><a href="build.php?gid=' + resEfficiency[i][3] + '">' + (i + 1) + '. Level ' + resEfficiency[i][1] + ' ' + resEfficiency[i][2] + '</a></li>';
            }
            html += '</ul>';
            TravianHelper.Display.createSidebar('Efficiency queue', html)
        }
    },

    fields: function() {
        var resources = TravianHelper.Utils.getCurrentResources();

        $('#village_map div').each(function(index) {
            if ($(this).hasClass('underConstruction')) {
                return true;
            }

            var classes = $(this).attr('class').split(' ');
            var gid = parseInt(classes[1].replace('gid', ''));
            var currentLevel = parseInt(classes[2].replace('level', ''));

            if (currentLevel >= 10) {
                return true;
            }

            var tile = TravianHelper.Enums.VillageInGID[gid];
            var upgradeCosts = TravianHelper.Enums.Tiles[tile];
            var costToUpgrade = upgradeCosts[currentLevel];

            if (currentLevel >= upgradeCosts.length) {
                return true;
            }

            for (var i = 0; i < 4; i++) {
                if (resources[i] < costToUpgrade[i]) {
                    return true;
                }
            }

            // All this should be unnecessary...I had to get the storage item
            // Each time because $(this) can't be used simultaneously as `this`
            // Even using $.proxy
            var taskList = JSON.parse(localStorage.getItem('taskList')) || {};
            var currentVillageID = TravianHelper.Utils.getCurrentVillageID();
            if (taskList[currentVillageID] != undefined && taskList[currentVillageID].length) {
                for (tasks in taskList[currentVillageID]) {
                    if (taskList[currentVillageID][tasks].id == index + 1) {
                        $(this).addClass('underConstruction').text(currentLevel += 1);
                        return true;
                    }
                }
            }

            $(this).css('border-radius', '50%').css('background-color', '#5cb85c').css('background-image', 'none').css('border', '2px solid gray');
        })
    },

    showTips: function() {
        $('area').on('mouseenter', function(e) {
            var resources = TravianHelper.Utils.getCurrentResources();
            var alt = $('.showCosts').html();
            if (alt != undefined && alt.length > 60 && alt.indexOf('isUpgradeReady') < 1) {
                var constructionLevel = false;
                var id = $(e.currentTarget).attr('href').replace('build.php?id=', '').trim();
                var tooltip = $('<div>').append($(e.currentTarget).attr('alt'));
                if (tooltip.find('.notice:last').length > 0) {
                    var level = tooltip.find('.notice:last').html();
                    var p = new RegExp('.*?' + '(\\d+)', ["i"]);
                    var m = p.exec(level);
                    if (m != null) {
                        var constructionLevel = m[1].replace(/</, "&lt;");
                    } else {
                        console.log('Level not found');
                        return true;
                    }
                }

                if (TravianHelper.Utils.URLContains(TravianHelper.Enums.Pages.VillageIn)) {
                    // Buildings
                    var index = $('#clickareas area').index(e.currentTarget);
                    var tiles = $("#village_map img").not(".clickareas, #lswitch, .onTop");
                    var imgTile = $(tiles[index]);

                    if (imgTile.hasClass('iso')) {
                        var gid = -1;
                    } else {
                        var gid = imgTile.attr("class").match(/g([0-9]{1,2})/)[1];
                    }

                    var levelObject = $('#levels div.aid' + id).text();
                    var currentLevel = parseInt(levelObject, 10) || 0;
                } else {
                    // Resource tiles
                    var tile = $('#village_map div')[id - 1];
                    var classes = $(tile).attr('class').split(' ');
                    var gid = parseInt(classes[1].replace('gid', ''));
                    var currentLevel = parseInt(classes[2].replace('level', ''));
                }

                var tile = TravianHelper.Enums.VillageInGID[gid];
                var upgradeCosts = TravianHelper.Enums.Tiles[tile];
                var level = constructionLevel || currentLevel;
                var costToUpgrade = upgradeCosts[level];

                var html = '<div>' + alt + '</div>';
                var total = 0;
                var canUpgrade = true;
                for (var i = 0; i < 4; i++) {
                    total += costToUpgrade[i];
                    if (resources[i] < costToUpgrade[i]) {
                        canUpgrade = false;
                    }
                };

                $('.showCosts').append('<br><span id="totalResTHelper">Total res: ' + TravianHelper.Utils.numberWithCommas(total) + '.</span><br>');

                if (costToUpgrade) {
                    var htmlFreeWheat = '<span class="resources r5"><img class="r5" src="img/x.gif">' + costToUpgrade[4] + '</span>';
                    var rPerWheat = costToUpgrade[4] > 0 ? Math.floor(total / costToUpgrade[4]) : 0;

                    // console.log(rPerWheat + ': lvl ' + level + ' ' + tile );

                    $('.showCosts .resources.r4').after(htmlFreeWheat)
                    $('#totalResTHelper').after('<br><span id="wheatPerResTHelper">Res per wheat: ' + TravianHelper.Utils.numberWithCommas(rPerWheat) + '</span><br>')
                }

                if (canUpgrade) {
                    $('.showCosts').append('<strong class="isUpgradeReady" style="color:#5cb85c;">Upgrade ready</strong>');
                } else {
                    $('.showCosts').append('<span class="isUpgradeReady" style="color:#d9534f;">Can\'t upgrade</span> ');
                }

            }
        })
    },

}