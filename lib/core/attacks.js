TravianHelper.Attacks = function(game)
{
    this.game = game;

    this.initialize();
}

TravianHelper.Attacks.prototype = {
    initialize: function()
    {
        if (TravianHelper.Utils.URLContains('build.php') && (this.game.url.z != undefined && this.game.url.id == 39) || (this.game.url.gid == 16 && this.game.url.tt == 2))
        {
            var maxRaid = $('a[onclick^="document.snd.t1.value="]').html();

            $("input[name='c']").prop("checked", true);
            $("input[name='t1']").val(this.game.settings.raidAmount);
        }

        if (this.game.settings.enableAttackSounds && $('.attack').length)
        {
            chrome.extension.sendRequest(
            {
                action: 'notify',
                id: 'attackNotify',
                msg: 'You are under attack!',
                title: 'Incoming attack'
            });
        }

    }
}