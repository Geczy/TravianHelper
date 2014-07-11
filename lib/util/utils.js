TravianHelper.Utils = {

    allBefore: function(str, chr) {
        return str.substr(0, str.indexOf(chr));
    },

    allAfter: function(str, chr) {
        return str.substring(str.indexOf(chr))
    },

    removeA: function(arr) {
        var what, a = arguments,
            L = a.length,
            ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    },

    getURL: function(theURL) {
        theURL = theURL ? theURL : window.location.href;

        if (theURL.indexOf('?') === -1) {
            return false;
        }

        var fullUrl = theURL.split('?');
        var urlParams = fullUrl[1].split('&');

        gets = new Array();

        for (i = 0; i <= urlParams.length - 1; ++i) {
            var param = urlParams[i].split('=');
            var name = param[0];
            var value = param[1];
            gets[name] = value;
        }
        return gets;
    },

    URLContains: function(text) {
        return document.URL.indexOf(text) != -1;
    },

    getCurrentResources: function() {
        var resources = [];

        for (var i = 1; i <= 4; i++) {
            resources.push(parseInt($('span#l' + i).text().trim().replace(',', '')));
        }

        return resources;
    },

    getCurrentVillageID: function() {
        id = 0;
        id = parseInt($('#sidebarBoxVillagelist a.active').attr('href').match(/([0-9])+/)[0].trim());

        if (id == 0 || isNaN(id)) {
            id = 9;
        }

        return id;
    },

    padLeft: function(value) {
        var str = value.toString();

        if (str.length == 1) {
            str = "0" + value;
        }

        if (str.length == 0) {
            str = "00" + value;
        }

        return str;
    },

    numberWithCommas: function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    convertSecondsToTime: function(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - hours * 3600) / 60);
        var seconds = Math.floor(seconds - minutes * 60 - hours * 3600);

        return this.padLeft(hours) + ":" + this.padLeft(minutes) + ":" + this.padLeft(seconds);
    },

    startTimer: function() {
        var start = window.performance.now();
        return start;
    },

    endTimer: function(msg, start) {
        var end = window.performance.now();
        var dur = end - start;
        console.log("\t[" + dur.toFixed(2) + "ms] " + msg);
    },

    hasPlus: function() {
        return $('button.workshopWhite').length > 0;
    },
}