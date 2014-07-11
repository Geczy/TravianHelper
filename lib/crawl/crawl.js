TravianHelper.CrawlManager = function(game) {
    this.game = game;

    console.log('---Begin crawling');

    var start = TravianHelper.Utils.startTimer();
    localStorage.setItem('villageInfo', JSON.stringify(this.villageNames()));
    TravianHelper.Utils.endTimer("Crawled village names", start);

    var start = TravianHelper.Utils.startTimer();
    this.crawlStorage(this.game.currentVillageID);
    TravianHelper.Utils.endTimer("Crawled village storage", start);

    var start = TravianHelper.Utils.startTimer();
    this.crawlProduction(this.game.currentVillageID);
    TravianHelper.Utils.endTimer("Crawled village production", start);

    console.log('---End crawling \n');

    // Loop every village
    // for (villageID in this.game.villageInfo) {

    // Auto advance
    // if (villageID != this.game.currentVillageID) {
    //     location.href = '?newdid=' + villageID;
    //     break;
    // }

    // }

}

TravianHelper.CrawlManager.prototype = {

    crawlStorage: function(villageID) {
        // Only do it once, TODO: Do it on interval 15 mins?
        // if (this.game.villageStorage[villageID] != undefined) {
        //     return true;
        // }

        /// <summary>
        /// Crawls for active village storages and crop production/consumption
        /// Supported versions: 4, 4.2
        /// </summary>

        var warehouseSize = parseInt($("#stockBarWarehouse").text().replace(",", "").replace(" ", "").replace(".", ""), 10) || 0;
        var granarySize = parseInt($("#stockBarGranary").text().replace(",", "").replace(" ", "").replace(".", ""), 10) || 0;

        var stored = [];
        var maxStorage = [];
        for (var index = 0; index < 4; index++) {
            stored[index] = parseInt($("#l" + (index + 1)).text().replace(",", "").replace(" ", "").replace(".", ""), 10) || 0;
            maxStorage[index] = index == 3 ? granarySize : warehouseSize;
        }

        // activeVillage.Resources.FreeCrop = parseInt($("#stockBarFreeCrop").text().replace(",", "").replace(" ", "").replace(".", ""), 10) || 0;

        this.game.villageStorage[this.game.currentVillageID] = stored;
        this.game.villageMaxStorage[this.game.currentVillageID] = maxStorage;

        localStorage.setItem('villageStorage', JSON.stringify(this.game.villageStorage));
        localStorage.setItem('villageMaxStorage', JSON.stringify(this.game.villageMaxStorage));

        return true;
    },

    crawlProduction: function(villageID) {
        // Only do it once, TODO: Do it on interval 15 mins?
        // if (this.game.villageProduction[villageID] != undefined) {
        //     return true;
        // }

        var scriptContent = $("script:contains('resources.production')").html();
        // Regular expression string from
        // http://txt2re.com/index-javascript.php3?s=resources.production%20=%20{%20%27l1%27:%20500,%27l2%27:%20556,%27l3%27:%20500,%27l4%27:%20367};&16&12&14&13&11
        var regexString = ".*?\\d+.*?(\\d+).*?\\d+.*?(\\d+).*?\\d+.*?(\\d+).*?\\d+.*?([-+]?\\d+)";
        var production = [];
        var p = new RegExp(regexString, ["i"]);
        var m = p.exec(scriptContent);
        if (m != null) {
            for (var i = 1; i < 5; i++) {
                production[i - 1] = parseInt(m[i], 10) || 0;
            };
        }

        this.game.villageProduction[this.game.currentVillageID] = production;
        localStorage.setItem('villageProduction', JSON.stringify(this.game.villageProduction));
    },

    // Any page
    villageNames: function() {
        var villageInfo = {};

        // Villages menu
        $('#sidebarBoxVillagelist').find('li').each(function() {
            // Cant parseint the values in this coord idk why, keeps returning NaN
            var coords = $(this).find('.coordinates').text().replace('(', '').replace(')', '').trim().split('|');
            var villageID = parseInt($(this).find('a').attr('href').match(/([0-9])+/)[0].trim());
            var name = $(this).find('.name').text().trim();

            var save = {
                id: villageID,
                name: name,
                coords: coords,
            };

            villageInfo[villageID] = save;
        });

        return villageInfo;
    }
}