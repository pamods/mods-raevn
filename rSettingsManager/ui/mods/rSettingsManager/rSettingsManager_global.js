//====================================
// rSettingsManager - Settings Manager
//------------------------------------
// rSettingsManager_global.js
// Created by Raevn
// Version 1.4.0 (2014/01/16)
//------------------------------------

function initialSettingValue(id, value) {
	var settings = decode(localStorage.settings);
	
	settings[id] = settings[id] ? settings[id] : value;

	localStorage.settings = encode(settings);
}