TravianHelper.Market = function(game) {
    this.game = game;

    if (TravianHelper.Utils.URLContains('t=5')) {
        this.initialize();
        this.hourProductionButton();
        this.trackTransports();
    }
}

TravianHelper.Market.prototype = {
    initialize: function() {
        var html = '';
        html += TravianHelper.Display.openHeader();

        html += '<select id="tHelperMarketVillage" name="tHelperMarketVillage">';
        html += '<option>Select a village</option>';
        for (i in this.game.villageInfo) {
            html += '<option value="' + i + '">' + this.game.villageInfo[i].name + '</option>';
        };
        html += '</select>';

        html += TravianHelper.Display.closeHeader();
        $('form[name="snd"]').after(html);

        $('#tHelperMarketVillage').on('change', $.proxy(function() {
            var sel = document.getElementById('tHelperMarketVillage').value;
            var villageInfo = this.game.villageInfo[sel];
            var villageStorage = this.game.villageStorage[sel];
            var villageMaxStorage = this.game.villageMaxStorage[sel];

            if (!$('#enterVillageName').val()) {
                $('#enterVillageName').val(villageInfo.name);
            }

            // $('#xCoordInput').val(villageInfo.coords[0]);
            // $('#yCoordInput').val(villageInfo.coords[1]);

            var html = '<br>';
            for (var i = 0; i < 4; i++) {
                var store = (villageMaxStorage[i] - villageStorage[i]);
                store = Math.floor((store - 100) / 10) * 10;

                html += '<img class="r' + (i + 1) + '" src="img/x.gif"> ';
                html += villageStorage[i] + ' / ' + villageMaxStorage[i] + ' ( ' + store + ' )';
                html += '<br>';
                var id = 'r' + (i + 1);
                $('#' + id).val(store);
            }
            $('#tHelperMarketVillage').after(html);

        }, this));
    },

    trackTransports: function() {
        var transports = {};
        $('.traders').each(function(index) {
            var sender = $(this).find('thead > tr > td > a');
            var senderUID = parseInt(sender.attr('href').replace('spieler.php?uid=', '').trim());
            var senderName = sender.text().trim();

            var resources = $(this).find('.res > td > span');
            var res = resources.text().trim().replace(/\s+/g, ' ');

            var repeat = 1;
            var repeatHTML = $(this).find('.repeat').text().trim();
            var m = new RegExp('.*?' + '(\\d+)', ["i"]).exec(repeatHTML);
            if (m != null) {
                var repeat = m[1];
                res = res.replace(repeatHTML, '').trim();
            }

            res = res.split(' ');
            for (var i = 0; i < res.length; i++) {
                // res[i] = res[i] * repeat;
                res[i] = parseInt(res[i]);
            }

            if (transports[senderUID] && transports[senderUID].length) {
                for (var i in transports[senderUID]) {
                    transports[senderUID][i] = (transports[senderUID][i] + res[i]);
                }
            } else {
                transports[senderUID] = res;
            }
        });

        console.log(transports);
    },

    hourProductionButton: function() {
        var useHour = $("<span>").text("1h").attr({
            id: "PAMEHourProductionButton",
            title: "Use this village's hour production"
        }).click($.proxy(function() {
            $.each($("#send_select input"), $.proxy(function(index, obj) {
                var production = this.game.villageProduction[this.game.currentVillageID][index];
                $(obj).val(production);
                $(obj).change();
            }, this));
        }, this));

        $("#send_select tr:eq(4) td").append(useHour);
    },

}