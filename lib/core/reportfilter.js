TravianHelper.ReportFilter = function(game)
{
    if (!TravianHelper.Utils.URLContains('berichte.php'))
    {
        return;
    }

    this.game = game;
    this.initialize();
}

TravianHelper.ReportFilter.prototype = {
    initialize: function()
    {
        var html = '';
        html += TravianHelper.Display.openHeader();
        html += '<input class="check" type="checkbox" id="sCarryNFull">';
        html += '<span style="margin-left: 8px;"><label for="sCarryNFull">select carry not full & no defence</label></span>';
        html += TravianHelper.Display.closeHeader();

        $('form[action="berichte.php"]').after(html);
        this.listener();
    },

    listener: function()
    {
        $('#sCarryNFull').change(function(e)
        {
        	var count = 0;
            $('.reportInfo.carry').not('.full').each(function()
            {
                var isNoDefence = $(this).closest('.sub').find('img.iReport.iReport1').attr('alt');

                if (isNoDefence)
                {
                	count++;
                	var input = $(this).closest('tr').find('.sel > input');
                    input.click();
                }
            });

            if(!count) {
            	$('div#thelper-alert').remove();
            	$('label[for="sCarryNFull"]').parent().prepend('<div id="thelper-alert"><b>No matching reports found</b></div>');
            }
        });
    }
}