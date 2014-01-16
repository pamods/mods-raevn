//====================================
// rSettingsManager - Settings Manager
//------------------------------------
// rSettingsManager.js
// Created by Raevn
// Version 1.4.0 (2014/01/16)
//------------------------------------

//Add Empty Groups so they appear first
$("#tab_graphic").children(":first").append('<table id="settings_group_GRAPHICS_" class="settings_group"></table>');
$("#tab_audio").children(":first").append('<table id="settings_group_AUDIO_" class="settings_group"></table>');
$("#tab_camera").children(":first").append('<table id="settings_group_CAMERA_" class="settings_group"></table>');
$("#tab_ui").children(":first").append('<table id="settings_group_UI_" class="settings_group"></table>');
$("#tab_servers").children(":first").append('<table id="settings_group_SERVERS_" class="settings_group"></table>');

model.additionalSettings = ko.observableArray();
model.additionalSettingDefaults = ko.observableArray();

model.addSetting_Button = function(displayName, buttonText, tab, callback, group) {
	model.addSetting(tab, 'Button', displayName, buttonText, callback, group);
}

model.addSetting_Text = function(displayName, id, tab, type, defaultValue, group) {
	var settings = decode(localStorage.settings);
	model[id] = ko.observable(settings[id] ? settings[id] : defaultValue);

	model.addSetting(tab, type, displayName, id, "", group);

	model.additionalSettings.push(id);
	model.additionalSettingDefaults.push(defaultValue);
}

model.addSetting_DropDown = function(displayName, id, tab, optionsArray, defaultIndex, group) {
	var settings = decode(localStorage.settings);
	model[id + '_options'] = ko.observableArray(optionsArray);
	model[id] = ko.observable(settings[id] ? settings[id] : model[id + '_options']()[defaultIndex]);

	model.addSetting(tab, 'DropDown', displayName, id, "", group);

	model.additionalSettings.push(id);
	model.additionalSettingDefaults.push(model[id + '_options']()[defaultIndex]);
}

model.addSetting_MultiSelect = function(displayName, id, tab, optionsArray, defaultOptionsArray, size, group) {
	var settings = decode(localStorage.settings);
	model[id + '_options'] = ko.observableArray(optionsArray);
	model[id] = ko.observable(settings[id] ? settings[id] : defaultOptionsArray);

	model.addSetting(tab, 'MultiSelect', displayName, id, size, group);

	model.additionalSettings.push(id);
	model.additionalSettingDefaults.push(defaultOptionsArray);
}

model.addSettingGroup = function(tab, group) {
	var settingSelector;

	switch (tab) {
		case 'GRAPHICS':
  			settingSelector = $("#tab_graphic").children(":first")
  			break;
		case 'AUDIO':
  			settingSelector = $("#tab_audio").children(":first")
  			break;
		case 'CAMERA':
  			settingSelector = $("#tab_camera").children(":first")
  			break;
		case 'UI':
  			settingSelector = $("#tab_ui").children(":first")
  			break;
		case 'SERVERS':
			settingSelector = $("#tab_servers").children(":first")
  			break;
	}
	
	group = group ? group : "";
	var groupReplaced = group.replace(/ |\/|\&|\(|\)|\[|\]|\\|\^|\$|\.|\||\?|\*|\+/g, '');
	
	if ($('#settings_group_' + tab + '_' + groupReplaced).length == 0) {
		settingSelector.append(
			'<table id="settings_group_' + tab + '_' + groupReplaced + '" class="settings_group">' + 
				'<tr>' +
					'<td colspan="2">' +
						'<div class="settings_group_label div_settings_control_lbl" style="text-transform: uppercase; margin: 0px 0px 8px 0px;">' + group + ' </div>' +
					'</td>' +
				'</tr>' +
			'</table>'
		);
	}
}

model.addSetting = function(tab, type, displayName, id, property, group) {
	model.addSettingGroup(tab, group);
	
	group = group ? group : "";
	var groupReplaced = group.replace(/ |\/|\&|\(|\)|\[|\]|\\|\^|\$|\.|\||\?|\*|\+/g, '');
	
	groupSelector = $('#settings_group_' + tab + '_' + groupReplaced);
	
	var startSettingHTML = '<tr><td><div class="div_settings_control_lbl">' + displayName + '</div></td><td>';
	var endSettingHTML = '</td></tr>';
			
	switch (type) {
		case 'DropDown':
			groupSelector.append(
				startSettingHTML +
				'<div class="div_settings_control_input">' + 
					'<select class="div_settings_control_select" data-bind="options: ' + id + '_options, value: ' + id + '" />' + 
				'</div>' +
				endSettingHTML);
			break;
		case 'MultiSelect':
			groupSelector.append(
				startSettingHTML +
				'<div class="div_settings_control_input">' + 
					'<select class="div_settings_control_select" data-bind="options: ' + id + '_options, selectedOptions: ' + id + '" size="' + property + '" multiple="true"/>' + 
				'</div>' +
				endSettingHTML);
			break;
		case 'Text':
			groupSelector.append(
				startSettingHTML +
				'<div class="div_settings_control_input">' + 
					'<input type="text" class="div_settings_control_text" data-bind="value: ' + id + '" />' + 
				'</div>' +
				endSettingHTML);
			break;
		case 'Number':
			groupSelector.append(
				startSettingHTML +
				'<div class="div_settings_control_input">' + 
					'<input type="Number" class="div_settings_control_number" data-bind="value: ' + id + '" />' + 
				'</div>' +
				endSettingHTML);
			break;
		case 'Button':
			groupSelector.append(
				startSettingHTML +
				'<div class="div_settings_control_input">' + 
					'<input type="Button" class="settings_button" data-bind="click: ' + property + '" value="' + id + '" />' + 
				'</div>' +
				endSettingHTML);
			break;
	}
}

//hook existing 'settings' method
model.oldSettings = model.settings;
model.settings = ko.computed(function () {
	var newSettings = model.oldSettings();

	for (var i = 0; i < model.additionalSettings().length; i++) {
		newSettings[model.additionalSettings()[i]] = model[model.additionalSettings()[i]]();
	}
	return newSettings;
});

//hook existing 'defaults' method
model.oldDefaults = model.defaults;
model.defaults = function () {
	for (var i = 0; i < model.additionalSettings().length; i++) {
		model[model.additionalSettings()[i]](model.additionalSettingDefaults()[i]);
	}
	model.oldDefaults();
};