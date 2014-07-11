TravianHelper.ResourceIndicator = function(game) {
    console.log('---Begin ResourceIndicator')

    this.game = game;

    var start = TravianHelper.Utils.startTimer();
    this.initialize();
    TravianHelper.Utils.endTimer("Added time left till full indicators", start);

    console.log('---End ResourceIndicator \n')
}

TravianHelper.ResourceIndicator.prototype = {
    initialize: function() {
        for (var i = 1; i < 5; i++) {
            $("#stockBarResource" + i + " img.res").after('<div class="travianHelper-resourceIndicatorBackground"></div>');
        };

        $('.travianHelper-resourceIndicatorBackground').css({
            "background": "-webkit-linear-gradient(top, rgba(237, 237, 237, 0) 0%,rgba(224, 231, 241, 0.98) 60%)",
            "height": "30px",
            "position": "absolute",
            "right": "2px",
            "top": "17px",
            "width": "76px",
            "border-bottom-left-radius": "10px",
            "border-bottom-right-radius": "10px",
            "box-shadow": "0px 1px 2px #888"
        });


        // Appends calculated time to page
        $(".travianHelper-resourceIndicatorBackground").each($.proxy(function(index) {
            var actualProduction = this.game.villageProduction[this.game.currentVillageID][index];

            // Create element to append
            var element = $("<div><b><p>");
            $("p", element).addClass("ResourceIndicatorFillTime");
            $("p", element).css("text-align", "center");
            $("p", element).html("Unknown");

            if (actualProduction == 0) {
                $(this).append(element);
                return true;
            }

            var current = this.game.villageStorage[this.game.currentVillageID][index];
            var timeLeft = 0;
            if (actualProduction > 0) {
                var max = this.game.villageMaxStorage[this.game.currentVillageID][index]
                timeLeft = (max - current) / actualProduction;
            } else {
                timeLeft = current / Math.abs(actualProduction);

                $("p", element).css("color", "red");
                $("p", element).addClass("negative");
            }
            $("p", element).attr("data-timeleft", timeLeft * 3600);
            $('.travianHelper-resourceIndicatorBackground:eq(' + index + ')').append(element);

        }, this));

        // Initial refresh
        this.refreshFunction();
        setInterval(this.refreshFunction, 1000);
    },

    /// <summary>
    /// Called in intervals to refresh times on elements
    /// </summary>
    /// <param name="cneg">Color for negative value</param>
    /// <param name="czero">Color for hours >= 3</param>
    /// <param name="calmost">Color for hours < 3</param>
    /// <param name="cclose">Color for hours < 0.75</param>
    /// <param name="cother">Color for hours = 0</param>
    refreshFunction: function(cneg, czero, calmost, cclose, cother) {
        $(".ResourceIndicatorFillTime").each(function() {
            // Get current time from element
            var secondsLeft = $(this).attr("data-timeleft");
            if (secondsLeft >= 0) {
                if (secondsLeft > 0) {
                    secondsLeft--;
                    $(this).attr("data-timeleft", secondsLeft);
                }
                $(this).html(TravianHelper.Utils.convertSecondsToTime(secondsLeft));
            }

            if ($(this).hasClass("negative")) {
                $(this).css("color", cneg || "#C00");
            } else {
                // Changes element style (color) depending on current time state
                if (secondsLeft === 0)
                    $(this).css("color", czero || "#C00");
                else if (secondsLeft < 2700)
                    $(this).css("color", calmost || "#B20C08");
                else if (secondsLeft < 10800)
                    $(this).css("color", cclose || "#A6781C");
                else $(this).css("color", cother || "#0C9E21");
            }
        });
    }
}