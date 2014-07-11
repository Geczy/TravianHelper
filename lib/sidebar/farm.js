var Farm = new Object();


Farm.init = function()
{
    Farm.displayList();

    if (Helper.URLContains('position_details.php') && Farm.showButton())
    {
        Farm.handleButton();
    }
}

Farm.displayList = function()
{
    idString = '';
    if (farmList.length > 0)
    {
        idString = '<ul>';
        for (var i = 0; i < farmList.length; i++)
        {
            // Raid: build.php?id=39&tt=2&z=
            // Village: karte.php?d=
            idString = idString + '<li><a href="/build.php?id=39&tt=2&z=' + farmList[i] + '">' + (i + 1) + '. ' + farmList[i] + '</a></li>';
        };
        idString = idString + '</ul>';
    }

    Display.createSidebar('Farm List', farmList.length > 0 ? idString : 'No farms');
}

Farm.showButton = function()
{
    string = Farm.getVillageID();
    if (!string)
    {
        return false;
    }

    html = '';
    html += '<div style="margin-top: 20px;margin-bottom: 20px;float: left;width: 365px;">';
    html += '<h4 class="round">Travian Helper</h4>';

    if (farmList.length > 0 && farmList.indexOf(string) != -1)
    {
        html += Display.createButton('Remove from farm list', 'removeFarmList');
    }
    else
    {

        html += Display.createButton('Add to farm list', 'addFarmList');
    }

    html += '</div>';
    $('#content.positionDetails').append(html);
}

Farm.handleButton = function()
{
    $('#addFarmList').on('click', function(e)
    {
        string = Farm.getVillageID();

        farmList.push(string);
        localStorage.setItem('farmList', JSON.stringify(farmList));

        window.location.reload();
        return;
    });

    $('#removeFarmList').on('click', function(e)
    {
        string = Farm.getVillageID();

        if (farmList.length > 0 && farmList.indexOf(string) != -1)
        {
            localStorage.setItem('farmList', JSON.stringify(Helper.removeA(farmList, string)));
        }

        window.location.reload();
        return;
    });
}

Farm.getVillageID = function()
{
    var url = $('a[href^="build.php?id=39&tt=2&z="]').attr('href');
    url = Helper.getURL(url);

    if (url.z == undefined)
    {
        return false;
    }

    return url.z;
}