
$('#A11').parent().parent().parent().before('<tr><td class="td_start_menu_item" data-bind="click: function () { model.showModsList(!model.showModsList());}"><span class="link_start_menu_item"><a href="#" id="A8" data-bind="click_sound: \'default\', rollover_sound: \'default\'"><span class="start_menu_item_lbl" >MODS</span></a></span></td></tr>');

model.showModsList = ko.observable(false);
model.modItems = ko.observableArray(rModsList);

$('canvas').each( function(i,c) {
	c.width = window.innerWidth;
	c.height = window.innerHeight;
});
		
createFloatingFrame('mods_list_frame', 270, 320, {'containment': '#nebulacanvas2', 'offset':'rightCenter', 'left': -560, 'top':-160, 'delayResize': true});
$('#mods_list_frame_content').append('<div class="div_mods"><div class="div_news_header">INSTALLED MODS<a data-bind="click_sound: \'default\'"><img style="float:right;" src="../shared/img/close_btn.png" data-bind="click: function () { model.showModsList(!model.showModsList()) }" /></a></div><div class="div_news_cont" data-bind="foreach: modItems"><div class="mod_list_item"><span class="text_mod_name" data-bind="text: name"></span> - <span class="text_mod_author" data-bind="text: author"></span><br/>Version <span data-bind="text: version"></span> (<span data-bind="text: build"></span>), Category: <span data-bind="text: category"></span></div></div></div>');
$('#mods_list_frame').attr("data-bind", "visible: showModsList");