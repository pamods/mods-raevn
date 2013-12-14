//Top Bar
createFloatingFrame('system_editor_top_frame', 'auto', 58, {'offset':'topCenter', 'left': -750});
$('.div_status_bar').appendTo('#system_editor_top_frame_content');

//Build Number
createFloatingFrame('system_version_info_frame', 168, 49, {'offset': 'topCenter', 'left': -84, 'top': 50});
$('#version_info').appendTo('#system_version_info_frame_content');

//Templates
createFloatingFrame('system_build_bar_frame', 800, 102, {'offset': 'bottomCenter', 'left': -400, 'top': -102});
$('.div_bottom_bar').appendTo('#system_build_bar_frame_content');

//Properties
//584
createFloatingFrame('system_properties_frame', 380, 'auto', {'offset': 'topRight', 'left': -380, 'top': 40});
$('.div_editor_panel').parent().appendTo('#system_properties_frame_content');

