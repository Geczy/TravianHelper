var THSettings = JSON.parse(localStorage.getItem('travianHelperSettings')) || {};

$(function() {
    $('.menu a').click(function(ev) {
        ev.preventDefault();
        var selected = 'selected';
        $('.mainview > *').removeClass(selected);
        $('.menu li').removeClass(selected);
        setTimeout(function() {
            $('.mainview > *:not(.selected)').css('display', 'none');
        }, 100);
        $(ev.currentTarget).parent().addClass(selected);
        var currentView = $($(ev.currentTarget).attr('href'));
        currentView.css('display', 'block');
        setTimeout(function() {
            currentView.addClass(selected);
        }, 0);
        setTimeout(function() {
            $('body')[0].scrollTop = 0;
        }, 200);
    });
    $('#launch_modal').click(function(ev) {
        ev.preventDefault();
        var modal = $('.overlay').clone();
        $(modal).removeAttr('style');
        $(modal).find('button, .close-button').click(function() {
            $(modal).addClass('transparent');
            setTimeout(function() {
                $(modal).remove();
            }, 1000);
        });
        $(modal).click(function() {
            $(modal).find('.page').addClass('pulse');
            $(modal).find('.page').on('webkitAnimationEnd', function() {
                $(this).removeClass('pulse');
            });
        });
        $(modal).find('.page').click(function(ev) {
            ev.stopPropagation();
        });
        $('body').append(modal);
    });
    $('.mainview > *:not(.selected)').css('display', 'none');

    // Saves options to chrome.storage
    function save_options() {
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({
            masterbuilder: $('#masterbuilder').is(':checked'),
            resourceIndicator: $('#resourceIndicator').is(':checked'),
            upgradeIndicator: $('#upgradeIndicator').is(':checked'),
        }, function() {

            $('<p id="alertmsg" class="alert">Settings saved.</p>').appendTo('.mainview.view div[class="selected"]');
            setTimeout(function() {
                $('#alertmsg').remove();
            }, 1000);

        });
    }

    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    function restore_options() {
        // Use default value color = 'red' and likesColor = true.
        chrome.storage.sync.get({
            masterbuilder: false,
            resourceIndicator: false,
            upgradeIndicator: false,
        }, function(items) {
            $('#masterbuilder').prop('checked', items.masterbuilder);
            $('#resourceIndicator').prop('checked', items.resourceIndicator);
            $('#upgradeIndicator').prop('checked', items.upgradeIndicator);
        });
    }
    restore_options();

    $("input, select, textarea").change(function() {
        save_options();
    });
});