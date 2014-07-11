TravianHelper.MessageLinker = function(game)
{
    if (!TravianHelper.Utils.URLContains('nachrichten.php'))
    {
        return;
    }

    this.game = game;
    this.initialize();
}

TravianHelper.MessageLinker.prototype = {
    initialize: function()
    {
        var message = $('#message').text();
        console.log(message);
    },

}