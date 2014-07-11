TravianHelper.Game = function(userSettings) {

    this.url = TravianHelper.Utils.getURL();
    this.currentVillageID = TravianHelper.Utils.getCurrentVillageID();

    this.farmList = localStorage.getItem('farmList');
    this.farmList = !this.farmList ? [] : JSON.parse(this.farmList);

    this.tribe = this.getTribeType();

    this.villageInfo = JSON.parse(localStorage.getItem('villageInfo')) || {};
    this.villageProduction = JSON.parse(localStorage.getItem('villageProduction')) || {};
    this.villageStorage = JSON.parse(localStorage.getItem('villageStorage')) || {};
    this.villageMaxStorage = JSON.parse(localStorage.getItem('villageMaxStorage')) || {};
    this.tasks = JSON.parse(localStorage.getItem('taskList')) || {};
    this.doneTimes = JSON.parse(localStorage.getItem('doneTimes')) || {};
    this.buildingSwaps = JSON.parse(localStorage.getItem('buildingSwaps')) || {};

    /**
     * @property {Object} settings - The default settings
     */
    this.settings = userSettings;

    //Initialize itself
    this.initialize();
}

TravianHelper.Game.prototype = {

    /**
     * Initialize the game, create all objects
     * @protected
     */
    initialize: function() {
        this.crawl = new TravianHelper.CrawlManager(this);

        new TravianHelper.BuildingMover(this);
        new TravianHelper.SmallTweaks(this);

        this.adventure = new TravianHelper.Adventure(this);
        this.tasklist = new TravianHelper.TaskList(this);

        if (this.settings.masterbuilder) {
            this.build = new TravianHelper.Build(this);
        }

        if (this.settings.upgradeIndicator) {
            this.upgradecheck = new TravianHelper.UpgradeCheck();
        }

        this.resourcecalc = new TravianHelper.ResourceCalc(this);
        this.attacks = new TravianHelper.Attacks(this);
        this.market = new TravianHelper.Market(this);
        this.reportfilter = new TravianHelper.ReportFilter(this);
        this.messagelinker = new TravianHelper.MessageLinker(this);

        if (this.settings.resourceIndicator) {
            this.resourceIndicator = new TravianHelper.ResourceIndicator(this);
        }

        this.reportResources = new TravianHelper.ReportResources(this);

        this.removeGoldButtonAnimation();
    },

    getTribeType: function() {
        for (var i = 1; i <= 3; i++) {
            if ($('.forceDisplayElement.vid_' + i).length) {
                return TravianHelper.Enums.Tribes[i];
            }
        };
    },

    removeGoldButtonAnimation: function() {
        var html = '<style type="text/css">';
        for (var i = 1; i <= 12; i++) {
            html += "ul#navigation li.gold a.ani_" + i + " { background-position: left 0px; }";
        };
        html += '</style>';

        $(html).appendTo("head")
    },

    get_server_time: function() {
        var d = new Date();
        var time = $('#tp1').text().trim();

        time = time.split(':');

        d.setHours(time[0]);
        d.setMinutes(time[1]);

        return d;
    }
}