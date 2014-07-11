var travianhelper;
var THOptions;

chrome.extension.sendRequest({
    action: 'gpmeGetOptions',
    defaults: {
        debug: false,
        raidAmount: 100,
        enableAttackSounds: false,
        masterbuilder: true,
        resourceIndicator: true,
        upgradeIndicator: true,
    },
}, function(theOptions) {
    THOptions = theOptions;
    //Initialize when fully loaded
    $(document).ready(function() {
        initializeTravianHelper();
    });
});

//Function that gets executed when the page is fully loaded
function initializeTravianHelper() {
    console.log('%c TravianHelper v0.1', 'font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; color: #fff; font-size: 20px; padding: 15px 20px; background: #444; border-radius: 4px; line-height: 100px; text-shadow: 0 1px #000');

    console.log('---Begin TravianHelper')
    console.log("\n")

    var options = {
        debug: false //Boolean to enable or disable the debugger
    };

    var start = TravianHelper.Utils.startTimer();

    //Create a new game
    var travianhelper = new TravianHelper.Game(THOptions);
    TravianHelper.Utils.endTimer("Script loaded", start);

    console.log("\n")
    console.log('---End TravianHelper')
    console.log("\n")
}