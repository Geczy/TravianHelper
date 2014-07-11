TravianHelper.SmallTweaks = function(game) {
    this.game = game;

    this.initialize();
}

TravianHelper.SmallTweaks.prototype = {
    initialize: function() {

        // Numbered member list
        if (TravianHelper.Utils.URLContains('allianz.php?s=1') || TravianHelper.Utils.URLContains('allianz.php?aid=')) {
            $('#member .pla').each(function(index) {
                $(this).prepend((index + 1) + '. ');
            })
        }
    },

}