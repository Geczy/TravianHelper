TravianHelper.ResourceCalc = function(game) {
    if (!TravianHelper.Utils.URLContains('build.php')) {
        return;
    }

    this.game = game;

    $('.text').on('input', $.proxy(function(index) {
        this.remains = [0, 0, 0, 0];
        this.displayRemainders();
    }, this));

    this.displayRemainders();
    this.displayTrade();
    this.inputTrade();
}

TravianHelper.ResourceCalc.prototype = {

    displayRemainders: function() {
        var resources = TravianHelper.Utils.getCurrentResources();
        var villInfo = this.game.villageInfo;

        $('.showCosts').each(function(index) {
            $(this).closest('.showCosts').find('.resAfterPurchase').remove();
            var costs = $(this);
            var remains = [];
            var multiplier = 1;
            var textVal = $(this).parent().find('input').val();
            if (textVal > 1) {
                multiplier = textVal;
            }

            $(this).children().each(function(index) {
                var res = parseInt($(this).text().trim().replace(',', ''));

                if (res > 0) {
                    var remainder = resources[index] - (res * multiplier);
                    if (!isNaN(remainder)) {
                        remains.push(remainder);
                    }
                }

            })

            // Only show helper if there's a negative value
            var append = false;
            for (var i in remains) {
                if (remains[i] < 0) {
                    append = true;
                }
            }

            if (!append) {
                return true;
            }

            var html = '';
            html += '<div class="resAfterPurchase">';
            html += '<p>Resources after purchase: </p>';
            $.each(remains, function(index, value) {
                html += ('<span class="resources r' + (index + 1) + '"><img class="r' + (index + 1) + '" src="img/x.gif">' + (value >= 0 ? value : ('<span style="color:#d9534f;">' + value + '</span>')) + '</span>');
            })
            html += '<div class="clear"></div>';
            html += '</div>';

            if (!$(this).closest('.showCosts').find('.resAfterPurchase').length) {
                html += '<div class="tradeMissingRes">';
                html += '<select name="tradeMissingResSelect">';
                html += '<option value="">Select a village</option>';
                for (i in villInfo) {
                    html += '<option value="' + i + '">' + villInfo[i].name + '</option>';
                };
                html += '</select>';
                html += '<a href="#">Send from selected village</a>';
                html += '<div class="clear"></div>';
                html += '</div>';
            }

            costs.append(html);

        });

    },

    displayTrade: function() {
        var currentVil = this.game.currentVillageID;
        $('.tradeMissingRes > a').on('click', function(e) {
            e.preventDefault();

            var fromVil = parseInt($(this).parent().find('select').val());
            if (fromVil) {
                var remains = [];

                $(this).parent().prev().find('span.resources').each(function(index) {
                    remains.push(parseInt($(this).text()));
                });

                localStorage.setItem('tempSendRes', JSON.stringify({
                    'to': currentVil,
                    'remains': remains
                }));

                location.href = '/build.php?gid=17&t=5&newdid=' + fromVil;
            }
        });
    },

    inputTrade: function() {
        if (TravianHelper.Utils.URLContains('gid=17&t=5&newdid')) {
            var send = JSON.parse(localStorage.getItem('tempSendRes')) || {};
            var name = this.game.villageInfo[send.to].name;

            $('#enterVillageName').val(name);

            for (var i in send.remains) {
                if (send.remains[i] < 0) {
                    var id = (parseInt(i) + 1);
                    var remain = Math.abs(send.remains[i]);
                    remain = Math.ceil(remain / 10) * 10;

                    $('#r' + id).val(remain);
                }
            }

            localStorage.removeItem('tempSendRes');
        }
    }
}