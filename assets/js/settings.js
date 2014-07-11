var alarm = new Audio(chrome.extension.getURL('assets/audio/alarm2.mp3'));
alarm.volume = 0.2;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == 'gpmeGetOptions') {

        chrome.storage.sync.get(request.defaults, function(items) {
            sendResponse(items);
            return true;
        });

        return true;
    }

    if (request.action == 'notify') {
        var opt = {
            type: "basic",
            title: request.title,
            message: request.msg,
            iconUrl: chrome.extension.getURL('assets/img/icon128.png'),
            buttons: [{
                title: 'Understood'
            }]
        }

        var noted = chrome.notifications.create(request.id, opt, function() {
            if (alarm.paused) {
                alarm.play();
            }

            chrome.notifications.onButtonClicked.addListener(function(id) {
                alarm.pause();
            })

            chrome.notifications.onClicked.addListener(function(id) {
                alarm.pause();
            })

            chrome.notifications.onClosed.addListener(function(id) {
                alarm.pause();
            })

        });

        chrome.notifications.getAll(function(notes) {

        })

        sendResponse({
            returnMsg: "All good!"
        });
    }
});