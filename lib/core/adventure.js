TravianHelper.Adventure = function(game) {
    this.doAdventures = false;
    this.game = game;

    this.initialize();
}

TravianHelper.Adventure.prototype = {
    initialize: function() {
        if (!this.enabled()) {
            if (TravianHelper.Utils.URLContains('start_adventure.php')) {
                $('button[name="ok"]').click();
            }
            return;
        }

        if (!TravianHelper.Utils.URLContains('adventure.php')) {
            location.href = 'hero_adventure.php';
            return;
        } else {
            this.process();
            $('button[name="start"]').click();
        }
    },

    enabled: function() {
        return this.doAdventures && $('.heroStatusMessage').text().trim().indexOf('in home') !== -1 && parseInt($('.adventureWhite .speechBubbleContent').text());
    },

    process: function() {
        var url = $('a.gotoAdventure:first').attr('href');
        if (url == undefined) {
            return;
        }

        location.href = url;
    }
}