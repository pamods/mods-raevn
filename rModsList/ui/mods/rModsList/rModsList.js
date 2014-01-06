$('#A11').parent().parent().parent().before('<tr><td class="td_start_menu_item" data-bind="click: function () { model.showModsList(!model.showModsList());}"><span class="link_start_menu_item"><a href="#" id="A8" data-bind="click_sound: \'default\', rollover_sound: \'default\'"><span class="start_menu_item_lbl" >MODS</span></a></span></td></tr>');

function loadJSON(src) {
    console.log(src, "loading json");
    var o = new XMLHttpRequest();
    try
    {
        o.open('GET', src, false);
        o.send('');
    }
    catch( err )
    {
        console.log("error loading " + src)
        return;
    }
    var jsonData = decode(o.responseText);
	var arrayData = [];
	
	for (var id in jsonData) {
		if (jsonData[id].enabled === true && id != "rPAMM") {
			arrayData.push(jsonData[id]);
			arrayData[arrayData.length - 1].author = arrayData[arrayData.length - 1].author ? arrayData[arrayData.length - 1].author : "";
			arrayData[arrayData.length - 1].build = arrayData[arrayData.length - 1].build ? arrayData[arrayData.length - 1].build : "";
			arrayData[arrayData.length - 1].display_name = arrayData[arrayData.length - 1].display_name ? arrayData[arrayData.length - 1].display_name : "";
			arrayData[arrayData.length - 1].version = arrayData[arrayData.length - 1].version ? arrayData[arrayData.length - 1].version : "";
		}
	}
    return arrayData;
}

model.showModsList = ko.observable(false);
model.modItems = ko.observableArray(loadJSON("coui://ui/mods/mods_list.json"));

$('canvas').each( function(i,c) {
	c.width = window.innerWidth;
	c.height = window.innerHeight;
});
		
createFloatingFrame('mods_list_frame', 270, 320, {'containment': '#nebulacanvas2', 'offset':'rightCenter', 'left': -560, 'top':-160, 'delayResize': true});
$('#mods_list_frame_content').append(
	'<div class="div_mods">' +
		'<div class="div_news_header">INSTALLED MODS<a data-bind="click_sound: \'default\'"><img style="float:right;" src="../shared/img/close_btn.png" data-bind="click: function () { model.showModsList(!model.showModsList()) }" /></a></div>' +
			'<div class="div_news_cont" data-bind="foreach: modItems">' +
				'<div class="mod_list_item">' +
					'<span class="text_mod_name" data-bind="text: display_name"></span> - <span class="text_mod_author" data-bind="text: author"></span><br/>Version <span data-bind="text: version"></span> (<span data-bind="text: build ? build : \'\'"></span>)</div></div></div>');
$('#mods_list_frame').attr("data-bind", "visible: model.showModsList");
