//====================================
// rSettingsManager - Settings Manager
//------------------------------------
// rSettingsManager.js
// Created by Raevn
// Version 1.6.0 (2014/06/16)
//------------------------------------

model.addSetting_Button = function(displayName, buttonText, tab, callback, group) {
	console.log("rSettingsManager: addSetting_Button is Deprecated");
}

model.addSetting_Text = function(displayName, id, tab, type, defaultValue, group) {
	console.log("rSettingsManager: addSetting_Text is Deprecated");
}

model.addSetting_Slider = function(displayName, id, tab, minValue, maxValue, defaultValue, group) {
	var settingSelector;

	switch (tab) {
		case 'GRAPHICS':
  			settingSelector = api.settings.definitions.graphics.settings;
  			break;
		case 'AUDIO':
  			settingSelector = api.settings.definitions.audio.settings;
  			break;
		case 'CAMERA':
  			settingSelector = api.settings.definitions.camera.settings;
  			break;
		case 'UI':
  			settingSelector = api.settings.definitions.ui.settings;
  			break;
		case 'SERVERS':
			settingSelector = api.settings.definitions.servers.settings;
  			break;
	}  
  
	var settings = {};
	settings[id] = {
	  title: displayName,
	  type: 'slider',
	  options: {
		min: minValue,
		max: maxValue,
		step: 1
	  },
	  default: defaultValue
	}
  
	_.extend(settingSelector, settings);
}

model.addSetting_DropDown = function(displayName, id, tab, optionsArray, defaultIndex, group) {
	var settingSelector;

	switch (tab) {
		case 'GRAPHICS':
  			settingSelector = api.settings.definitions.graphics.settings;
  			break;
		case 'AUDIO':
  			settingSelector = api.settings.definitions.audio.settings;
  			break;
		case 'CAMERA':
  			settingSelector = api.settings.definitions.camera.settings;
  			break;
		case 'UI':
  			settingSelector = api.settings.definitions.ui.settings;
  			break;
		case 'SERVERS':
			settingSelector = api.settings.definitions.servers.settings;
  			break;
	}  
	
	var settings = {};
	settings[id] = {
	  title: displayName,
	  type: 'select',
	  options: optionsArray,
	  default: optionsArray[defaultIndex]
	}
  
	_.extend(settingSelector, settings);
}

model.addSetting_MultiSelect = function(displayName, id, tab, optionsArray, defaultOptionsArray, size, group) {
	console.log("rSettingsManager: addSetting_MultiSelect is Deprecated");
}

model.addSettingGroup = function(tab, group) {
	console.log("rSettingsManager: addSettingGroup is Deprecated");
}

model.addSetting = function(tab, type, displayName, id, property, group) {
	console.log("rSettingsManager: addSetting is Deprecated");
}
