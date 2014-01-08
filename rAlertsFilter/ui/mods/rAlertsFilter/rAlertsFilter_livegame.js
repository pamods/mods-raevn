var settings = decode(localStorage.settings);
initialSettingValue("rReadyAlerts", ["Factory"]);
initialSettingValue("rUnderAttackAlerts", ["Commander"]);
initialSettingValue("rDestroyedAlerts", ["Structure"]);
setTimeout(function () {
	engine.call('watchlist.setCreationAlertTypes', JSON.stringify(settings["rReadyAlerts"]));
	engine.call('watchlist.setDamageAlertTypes', JSON.stringify(settings["rUnderAttackAlerts"]));
	engine.call('watchlist.setDeathAlertTypes', JSON.stringify(settings["rDestroyedAlerts"]));
}, 1000);