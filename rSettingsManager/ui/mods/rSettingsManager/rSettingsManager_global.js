//====================================
// rSettingsManager - Settings Manager
//------------------------------------
// rSettingsManager_global.js
// Created by Raevn
// Version 1.5.0 (2014/01/27)
//------------------------------------

function initialSettingValue(id, value) {
	var settings = decode(localStorage.settings);
	
	settings[id] = settings[id] ? settings[id] : value;

	localStorage.settings = encode(settings);
}