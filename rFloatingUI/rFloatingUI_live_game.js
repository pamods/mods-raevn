//Player List
createFloatingFrame('player_list_frame', 201, 75, {});
$('.div_player_list_panel').appendTo('#player_list_frame_content');

//Status Bar
createFloatingFrame('status_bar_frame', 740, 58, {'offset': 'topCenter', 'left': -370});
$('.div_status_bar_cont').appendTo('#status_bar_frame_content');

//Build number
createFloatingFrame('version_info_frame', 148, 29, {'offset': 'topCenter', 'left': -74, 'top': 50});
$('#version_info').appendTo('#version_info_frame_content');

//Menu Bar
createFloatingFrame('menu_frame', 98, 332, {'offset': 'leftCenter', 'top': -166});
$('.div_sidebar_left').appendTo('#menu_frame_content');
$('#menu_frame').attr("data-bind", "visible: model.showOptionsBar");

//Command Bar
createFloatingFrame('command_bar_frame', 72, 620, {'offset': 'rightCenter', 'left': -72, 'top': -310});
$('.div_sidebar_right').appendTo('#command_bar_frame_content');
$('#command_bar_frame').attr("data-bind", "visible: model.showCommands");

//Build Menu
createFloatingFrame('build_bar_frame', 800, 102, {'offset': 'bottomCenter', 'left': -400, 'top': -102});
$('.div_bottom_bar').appendTo('#build_bar_frame_content');
$('#build_bar_frame').attr("data-bind", "visible: model.showBuildList");

//Chrono Cam Icon
createFloatingFrame('chrono_icon_frame', 69, 50, {'offset': 'bottomRight', 'left': -76, 'top': -58});
$('.div_time_invoke_cont').appendTo('#chrono_icon_frame_content');

//Chrono Cam
createFloatingFrame('chrono_frame', 498, 97, {'offset': 'bottomCenter', 'left': -249, 'top': -147});
$('.div_time_bar').appendTo('#chrono_frame_content');
$('#chrono_frame').attr("data-bind", "visible: model.showTimeControls");

//Chat
createFloatingFrame('chat_frame', 320, 28, {'offset': 'bottomLeft', 'left': 20, 'top': -188});
$('#chat').appendTo('#chat_frame_content');

//Planet List
createFloatingFrame('planet_list_frame', 240, 191, {'offset': 'topRight', 'left': -240, 'top': 40});
$('.div_planet_list_panel').appendTo('#planet_list_frame_content');
$('#planet_list_frame').attr("data-bind", "visible: model.showCelestialViewModels");

//Planet Details
createFloatingFrame('planet_details_frame', 136, 100, {'offset': 'topRight', 'left': -371, 'top': 71});
$('.div_planet_detail_panel').appendTo('#planet_details_frame_content');
$('#planet_details_frame').attr("data-bind", "visible: model.showPlanetDetailPanel");