$('#tab_commanders .div_settings_graphics_cont').prepend(
	'<div class="commander_preview_cont">' +
		'<img class="commander_preview_image" src="" data-bind="attr: {src: model.selectedIndex() > -1 ? model.commanders()[model.selectedIndex()].ImgSource : \'\'}">' +
		'<div class="commander_preview_name" data-bind="text: model.selectedIndex() > -1 ? model.commanders()[model.selectedIndex()].DisplayName : \'\'"></div>' +
	'</div>' +
	'<div class="commander_scroll"></div>');
$('#tab_commanders .div_settings_graphics_cont table').appendTo('.commander_scroll');