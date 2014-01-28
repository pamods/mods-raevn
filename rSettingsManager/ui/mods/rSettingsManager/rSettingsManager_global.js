//====================================
// rSettingsManager - Settings Manager
//------------------------------------
// rSettingsManager_global.js
// Created by Raevn
// Version 1.5.1 (2014/01/28)
//------------------------------------

function initialSettingValue(id, value) {
	var settings = decode(localStorage.settings);
	
	settings[id] = settings[id] != null ? settings[id] : value;

	localStorage.settings = encode(settings);
}