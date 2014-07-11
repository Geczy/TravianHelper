TravianHelper.BuildingMover = function(game) {
    this.game = game;
    this.movingBuildings = false;
    this.clickedFirst = false;

    if (!TravianHelper.Utils.URLContains('dorf2.php')) {
        return;
    }

    this.div = document.createElement('div');
    this.div.setAttribute('style', 'position:absolute; top:31px; left:30px; padding:2px; z-index:100; border:none; cursor:pointer');
    this.div.innerHTML = '<img title="" src="">';
    $('#lswitch').after(this.div);
    this.changeTrucks();
    this.initialize();

    $(this.div).on('click', $.proxy(function() {
        this.movingBuildings = !this.movingBuildings;
        if (this.movingBuildings) {
            this.addClickEvents();
        } else {
            window.location.reload();
        }
        this.changeTrucks();
    }, this));

    // var html = '<img src="img/x.gif" id="moveSwitch" class="" onclick="" alt="" style="background-image: url(http://tx3.travian.us/gpack/travian_4.4delusion/img/a/minusBig.png);position: absolute;top: 31px;left: 73px;cursor: pointer;z-index: 500;">';
    // $('#levels').after(html);
}

TravianHelper.BuildingMover.prototype = {

    changeTrucks: function() {
        var unclicked = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAgACUDASIAAhEBAxEB/8QAGgABAAMAAwAAAAAAAAAAAAAACAAGBwEEBf/EACwQAAIBAwQCAQIFBQAAAAAAAAECAwQFEQAGEiEHMRMUIggVIzJxGEFSofD/xAAYAQADAQEAAAAAAAAAAAAAAAADBAUGAv/EACURAAICAgADCQAAAAAAAAAAAAECAAMEEQUSIQYTIjFBUWFxkf/aAAwDAQACEQMRAD8AY8rsoPH36Gf+9aD/APUR52u9e8FLS2ulnQE/TUNCGwqhS3ISF2zgn1k5yAvrTflALEEgetAfylLV7Zi3e1JK0BvN2rKOF1kAKpT1lasikdseUfBRgemPeksy56wAnqdQ+Oiu2jNd8FebvKO43M9/slru1sSjapk/L4mjr0AmMXUXIrIRxdvj+xiAeJY4VkbY7xQ3y1U90tVZFVUdQvOKWPsMM4P8EEEEHBBBBHWjz+HaOjO4NwS0otb4s9rDfQ06xqpL1hIbDNlsFSTkZ6GOtWC57mvGy/LVTHbrUs+2aijpa2+mOLL0ru9Qn1KAOGLH4k5IsblgjEFW/fm8ftGzcUfBtGgACDv310MNfQq9Vm7x8uP3HJ1NdHb91t95tq3C2VUdTTu7AMvRVgcMrA9qynIKkAgggjI1NbBWDDYiU8TftBTmjqLvNVR0sVHCZaiSaXhGsSAszEnpcLk5PXvOPehmu0Y62z3DdG5aKa5XK9VMxsVqp6dRJVSSM0jycfj5iNmJcKSCi/uY9MUz5psO8t0bpoLallqq7aFLHHVSQ0dRAprasOeKTiWRD8UYVWCjIZmBJygxPGnjW7wblbem8/ga7yRiOjoYJecVthHfDkenlY4ZnA9rgEgnkzWEC8zfkmZLZVt601+FR1J8t/Ag2rbx5P2Vd57DQUW56C8zQQmpd6w1RkwhdRD8ahQn6khxlhk4ypB1rm1PH3nPd+0Khqiqq7O91popFrLrVs5ZFSTiGCt8scgk4MoEYRQ7MMsBljrGAB16/wBfxrkov+Of76lvg47tzlBv6lbvDKH4C2Pc/H3juCwXi8G61xmeeWQdpGWC/po2AzquOmYAnvpRhRNX5AAMAAd561NNKABoTknc/9k=';
        var clicked = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAgACUDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAABwgABQYBBP/EADAQAAIBBAEDAgMGBwAAAAAAAAECAwQFBhEHABIhEzEIFCMVIiYyNFFBQ1ZlcbTT/8QAGQEAAgMBAAAAAAAAAAAAAAAAAQYEBQgH/8QAKBEAAgEDAwIFBQAAAAAAAAAAAQIDAAQFERIhBhMxQXGS0RVRVGGB/9oADAMBAAIRAxEAPwAj8H8VYFknFVnvd5sHzVwqfXEsxq507u2eRR91XUaCqPbXt+/SrfaWQ3eveClwu10s6An5ahaobSqFLdwkldt6J9tnewF9unf+GcA8IY+CQP1P+zN0qHKUtXjMWXtSStAbzdqyjhdZACqU9ZWrIpHlj3R9ijQ9mPnqjaONbePaikkDy/VOmVzWSXK3Ma3LhRI4ADsAAGPAGtWnBUEeRuZ7/wAd2u7WxKNqmT7Pq6uOvQCYxeIvWKyEdrt6f3GIB7Sx0rMbY+IuHb5aqe6WqxRVVHUL3xSx3CpIYb0f5nggggg6IIII8dYL4do6M5BkEtKLW+rPaw3yNOsaqS9YSG0zbbRUk7G/A1460Fzya8YXy1Ux261LPjNRR0tbfTHFt6V3eoT5lAHDFj6SdyLG5YIxBVvz0Vvl4Wyj2MsagAAg8eenBqBPmsqvK3Unvb5oSfEridhw7OqK2Y7QfJUstsjneP1nk25llUnbsT7KB+3jqde34rLrb7zn1ruFsqo6mnezoAy+CrCecMrA+VZTsFSAQQQRsdTo3u3vts8K750tNLPiLeSVizFeSTqT6k0U+IKCnPAVmu81VHSxUcNVLUSTS9kaxJUTMzEnwul2dnx77179L4uIx1tnuGUZLRTXK5XqpmNitVPTqJKqSRmkeTt9PvEbMS4UkFF/Mx8MbmizqifE8XxK8S1T4/bI3qqqko02aurNVK6JP3FdxRr2OFUkMzgkgoANvxpleBQZK2aZnlUDXeSMR0dDBSVTxW2EeezuMenlY6ZnA910CQT3OFjc2qW6F3XUAcajx0rPHU2Dzt1m51t7aTt9x23BG0I3HQA6ef3pf628cn4Vd57DQUWT0F5mghNS71hqjJpC6iH01ChPqSHW2GzrakHouYpx9znl+IVDVFVV2d7rTRSLWXWrZyyKknaGCt6scgk7GUCMIodmG2A2fl5y4qAH4o9v7fU+P8fT66ecuKf6o3/H9BU/8+obpj3beSuv8o/Qsx+LJ7G+KVXlDB7nx9WWawXi8G61xtazyyDykZaaX6aNoM6rrwzAE+fCjSidaL4l8rx/MM7orljdcK2kitiQPIIXj1IJZWI06g+zA71rz1Olu8KmdivhWhuloZIcRbxyqVYLyCNCPUGv/9k=';
        if (this.movingBuildings == true) {
            this.div.childNodes[0].title = "Stop Swapping Buildings";
            this.div.childNodes[0].src = clicked;
        } else {
            this.div.childNodes[0].title = "Swap Buildings";
            this.div.childNodes[0].src = unclicked;
        }
    },

    initialize: function() {
        var villageMap = $("#village_map");
        var areas = $('#clickareas area');
        var tiles = $("img", villageMap).not(".clickareas, #lswitch, .onTop");

        if (this.game.buildingSwaps[this.game.currentVillageID]) {
            for (var i = 0; i < this.game.buildingSwaps[this.game.currentVillageID].length; i++) {
                var a = this.game.buildingSwaps[this.game.currentVillageID][i];
                index = a[0] || 0;
                areaTile = $(areas[index]);
                imgTile = $(tiles[index]);
                id = areaTile.attr('href').replace('build.php?id=', '').trim();

                var first = [
                    id, areaTile, imgTile, index
                ];

                index = a[1] || 0;
                areaTile = $(areas[index]);
                imgTile = $(tiles[index]);
                id = areaTile.attr('href').replace('build.php?id=', '').trim();

                var second = [
                    id, areaTile, imgTile, index
                ];

                this.swap(first, second);
            }
        }
    },

    addClickEvents: function() {
        // Set to last swapped
        var villageMap = $("#village_map");
        var areas = $('#clickareas area');
        var tiles = $("img", villageMap).not(".clickareas, #lswitch, .onTop");

        // Don't continue
        if (!this.movingBuildings) {
            return;
        }

        areas.each($.proxy(function(index) {
            var areaTile = $(areas[index]);
            var imgTile = $(tiles[index]);
            var id = areaTile.attr('href').replace('build.php?id=', '').trim();

            if (imgTile.hasClass('iso')) {
                var gid = -1;
            } else {
                var gid = imgTile.attr("class").match(/g([0-9]{1,2})/)[1];
            }

            areaTile.on('click', $.proxy(function(e) {
                e.preventDefault();

                // skip wall, rally point, main building
                if (gid == 16 || gid == 31 || gid == 15) {
                    console.log("You can't swap that one");
                    return;
                }

                if (!this.clickedFirst) {
                    this.first = [
                        id, areaTile, imgTile, index
                    ];
                    this.clickedFirst = true;
                    console.log("Now click the second building");
                } else {
                    this.second = [
                        id, areaTile, imgTile, index
                    ];
                    this.clickedFirst = false;

                    // Check if we're returning the building to the original position manually
                    // If so, delete it from the localobject instead of swapping twice
                    var returnToOriginal = false;
                    if (this.game.buildingSwaps[this.game.currentVillageID]) {
                        for (var i = 0; i < this.game.buildingSwaps[this.game.currentVillageID].length; i++) {
                            var a = this.game.buildingSwaps[this.game.currentVillageID][i];
                            if ((this.first[3] == a[0] && this.second[3] == a[1]) || (this.first[3] == a[1] && this.second[3] == a[0])) {
                                returnToOriginal = true;
                                break;
                            }
                        }
                    }

                    // Check if this index has been moved already
                    // if (!returnToOriginal && this.game.buildingSwaps[this.game.currentVillageID]) {
                    //     for (var i = 0; i < this.game.buildingSwaps[this.game.currentVillageID].length; i++) {
                    //         var a = this.game.buildingSwaps[this.game.currentVillageID][i];
                    //         if (this.first[3] == a[0] || this.first[3] == a[1] || this.second[3] == a[0] || this.second[3] == a[1]) {
                    //             console.log("You've already swapped that one");
                    //             return;
                    //         }
                    //     }
                    // }

                    if (returnToOriginal) {
                        // Remove from array
                        console.log("Returning building to original position");
                        this.game.buildingSwaps[this.game.currentVillageID] = TravianHelper.Utils.removeA(this.game.buildingSwaps[this.game.currentVillageID], a)
                    } else {
                        /*
                         * Save
                         */
                        if (this.game.buildingSwaps[this.game.currentVillageID]) {
                            this.game.buildingSwaps[this.game.currentVillageID].push([this.first[3], this.second[3]]);
                        } else {
                            this.game.buildingSwaps[this.game.currentVillageID] = [
                                [this.first[3], this.second[3]]
                            ];
                        }
                    }


                    this.swap(this.first, this.second);
                    localStorage.setItem('buildingSwaps', JSON.stringify(this.game.buildingSwaps));
                }

            }, this));

        }, this));
    },

    swap: function(first, second) {
        /*
         * Image
         */
        var firstStyle = first[2].attr('style');
        var secondStyle = second[2].attr('style');

        second[2].attr('style', firstStyle);
        first[2].attr('style', secondStyle);

        /*
         * Tooltip
         */
        var firstCoords = first[1].attr('coords');
        var secondCoords = second[1].attr('coords');

        second[1].attr('coords', firstCoords);
        first[1].attr('coords', secondCoords);

        /*
         * Level
         */
        var secondLevel = $('div.aid' + second[0]);
        var firstLevel = $('div.aid' + first[0]);

        // Moving to an empty spot?
        if (!secondLevel.length) {
            var pos = TravianHelper.Enums.LevelPositions[second[3]];
            firstLevelStyle = firstLevel.attr('style', 'left:' + pos[0] + 'px;top:' + pos[1] + 'px;');
        } else if (!firstLevel.length) {
            var pos = TravianHelper.Enums.LevelPositions[first[3]];
            secondLevelStyle = secondLevel.attr('style', 'left:' + pos[0] + 'px;top:' + pos[1] + 'px;');
        } else {
            firstLevelStyle = firstLevel.attr('style');
            secondLevelStyle = secondLevel.attr('style');

            secondLevel.attr('style', firstLevelStyle);
            firstLevel.attr('style', secondLevelStyle);
        }

        if (firstLevel.length && firstLevel.attr('class').indexOf('underConstruction') !== -1) {
            firstLevel.attr('class', 'aid' + first[0] + ' underConstruction');
            secondLevel.attr('class', 'aid' + second[0]);
        }

        if (secondLevel.length && secondLevel.attr('class').indexOf('underConstruction') !== -1) {
            secondLevel.attr('class', 'aid' + second[0] + ' underConstruction');
            firstLevel.attr('class', 'aid' + first[0]);
        }

    },

}