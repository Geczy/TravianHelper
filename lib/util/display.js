TravianHelper.Display = {

    openHeader: function()
    {
        var html = '';
        html += '<div style="margin-top: 20px;margin-bottom: 20px;float: left;width: 365px;">';
        html += '<h4 class="round">Travian Helper</h4>';

        return html;
    },

    closeHeader: function()
    {
        var html = '';
        html += '</div>';

        return html;
    },

    createButton: function(text, id)
    {
        return '<button type="button" value="' + text + '" id="' + id + '" class="green">\
			<div class="button-container addHoverClick ">\
				<div class="button-background">\
					<div class="buttonStart">\
						<div class="buttonEnd">\
							<div class="buttonMiddle"></div>\
						</div>\
					</div>\
				</div>\
				<div class="button-content">' + text + '</div>\
			</div>\
		</button>';
    },

    createSidebar: function(header, content)
    {
        html = '';
        html += '<div id="" class="sidebarBox">\
			<div class="sidebarBoxBaseBox">\
				<div class="baseBox baseBoxTop">\
					<div class="baseBox baseBoxBottom">\
						<div class="baseBox baseBoxCenter"></div>\
					</div>\
				</div>\
			</div>\
			<div class="sidebarBoxInnerBox">\
				<div class="innerBox header">\
					<button type="button" id="" class="layoutButton overviewWhite green" onclick="return false;">\
					</button>\
					<div class="clear"></div>\
					<div class="boxTitle">' + header + '</div>\
				</div>\
				<div class="innerBox content">\
					<div class="linklistNotice">' + content + '</div>\
				</div>\
				<div class="innerBox footer">\
				</div>\
			</div>\
		</div>';

        return $('#sidebarBoxLinklist').after(html);
    }

}