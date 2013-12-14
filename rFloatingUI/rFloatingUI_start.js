//Menu
createFloatingFrame('start_menu_frame', 340, 578, {'containment': '#nebulacanvas2', 'offset':'bottomLeft', 'left': 0, 'top':-578, 'delayResize': true});
$('.div_start_menu').appendTo('#start_menu_frame_content');
		
$(document).ready(function () {
    if (sessionStorage['initial_cross_fade2_complete']) {
        return;
	}
		
	$('#start_menu_frame').hide().delay(2000).fadeIn(3000);
	
    sessionStorage['initial_cross_fade2_complete'] = 'true';
});

//News
createFloatingFrame('news_frame', 270, 320, {'containment': '#nebulacanvas2', 'offset':'rightCenter', 'left': -270, 'top':-160, 'delayResize': true});
$('.div_news').appendTo('#news_frame_content');
$('#news_frame').attr("data-bind", "visible: model.showPatchNotes");