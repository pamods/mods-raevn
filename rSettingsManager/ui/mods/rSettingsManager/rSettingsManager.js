model.additionalSettings = ko.observableArray();
model.additionalSettingDefaults = ko.observableArray();

model.addSetting_Button = function(displayName, buttonText, tab, callback) {
	model.addSetting(tab, 'Button', displayName, buttonText, callback);
}

model.addSetting_Text = function(displayName, id, tab, type, defaultValue) {
	var s = decode(localStorage.settings);
	model[id] = ko.observable(s[id] ? s[id] : defaultValue);

	model.addSetting(tab, type, displayName, id, "");

	model.additionalSettings.push(id);
	model.additionalSettingDefaults.push(defaultValue);
}

model.addSetting_DropDown = function(displayName, id, tab, optionsArray, defaultIndex) {
	var s = decode(localStorage.settings);
	model[id + '_options'] = ko.observableArray(optionsArray);
	model[id] = ko.observable(s[id] ? s[id] : model[id + '_options']()[defaultIndex]);

	model.addSetting(tab, 'DropDown', displayName, id, "");

	model.additionalSettings.push(id);
	model.additionalSettingDefaults.push(model[id + '_options']()[defaultIndex]);
}

model.addSetting_MultiSelect = function(displayName, id, tab, optionsArray, defaultOptionsArray, size) {
	var s = decode(localStorage.settings);
	model[id + '_options'] = ko.observableArray(optionsArray);
	model[id] = ko.observable(s[id] ? s[id] : defaultOptionsArray);

	model.addSetting(tab, 'MultiSelect', displayName, id, size);

	model.additionalSettings.push(id);
	model.additionalSettingDefaults.push(defaultOptionsArray);
}

model.addSetting = function(tab, type, displayName, id, property) {
	var settingSelector;

	switch (tab) {
		case 'GRAPHICS':
  			settingSelector = $(".div_settings_control_lbl:contains('QUALITY PRESET')").parent().parent().parent();
  			break;
		case 'AUDIO':
  			settingSelector = $(".div_settings_control_lbl:contains('MASTER VOLUME')").parent().parent().parent();
  			break;
		case 'CAMERA':
  			settingSelector = $(".div_settings_control_lbl:contains('MOUSE PAN SPEED')").parent().parent().parent();
  			break;
		case 'UI':
  			settingSelector = $(".div_settings_control_lbl:contains('CINEMATIC')").parent().parent().parent();
  			break;
		case 'SERVERS':
			settingSelector = $(".div_settings_control_lbl:contains('REGION')").parent().parent().parent();
  			break;
		default:
			settingSelector = $(".div_settings_" + tab + "_cont");
			break;
	}
	switch (type) {
		case 'DropDown':
			settingSelector.append(
				'<tr>' + 
					'<td>' + 
						'<div class="div_settings_control_lbl">' + displayName + '</div>' + 
					'</td>' + 
					'<td>' + 
						'<div class="div_settings_control_input">' + 
							'<select class="div_settings_control_select" data-bind="options: ' + id + '_options, value: ' + id + '" />' + 
						'</div>' + 
					'</td>' +                         
				'</tr>');
			break;
		case 'MultiSelect':
			settingSelector.append(
				'<tr>' + 
					'<td>' + 
						'<div class="div_settings_control_lbl">' + displayName + '</div>' + 
					'</td>' + 
					'<td>' + 
						'<div class="div_settings_control_input">' + 
							'<select class="div_settings_control_select" data-bind="options: ' + id + '_options, selectedOptions: ' + id + '" size="' + property + '" multiple="true"/>' + 
						'</div>' + 
					'</td>' +                         
				'</tr>');
			break;
		case 'Text':
			settingSelector.append(
				'<tr>' + 
					'<td>' + 
						'<div class="div_settings_control_lbl">' + displayName + '</div>' + 
					'</td>' + 
					'<td>' + 
						'<div class="div_settings_control_input">' + 
							'<input type="text" class="div_settings_control_text" data-bind="value: ' + id + '" />' + 
						'</div>' + 
					'</td>' +                         
				'</tr>');
			break;
		case 'Number':
			settingSelector.append(
				'<tr>' + 
					'<td>' + 
						'<div class="div_settings_control_lbl">' + displayName + '</div>' + 
					'</td>' + 
					'<td>' + 
						'<div class="div_settings_control_input">' + 
							'<input type="Number" class="div_settings_control_number" data-bind="value: ' + id + '" />' + 
						'</div>' + 
					'</td>' +                         
				'</tr>');
			break;
		case 'Button':
			settingSelector.append(
				'<tr>' + 
					'<td>' + 
						'<div class="div_settings_control_lbl">' + displayName + '</div>' + 
					'</td>' + 
					'<td>' + 
						'<div class="div_settings_control_input">' + 
							'<input type="Button" class="settings_button" data-bind="click: ' + property + '" value="' + id + '" />' + 
						'</div>' + 
					'</td>' +                         
				'</tr>');
			break;
	}
}

model.oldSettings = model.settings;

model.settings = ko.computed(function () {
	var newSettings = model.oldSettings();

	for (var i = 0; i < model.additionalSettings().length; i++) {
		newSettings[model.additionalSettings()[i]] = model[model.additionalSettings()[i]]();
	}
	return newSettings;
});

model.oldDefaults = model.defaults;

model.defaults = function () {
	for (var i = 0; i < model.additionalSettings().length; i++) {
		model[model.additionalSettings()[i]](model.additionalSettingDefaults()[i]);
	}
	model.oldDefaults();
};