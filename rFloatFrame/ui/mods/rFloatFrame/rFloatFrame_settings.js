model.registerFrameSetting = function(id, displayName, showByDefault) {
	initialSettingValue(id, showByDefault ? 'SHOW' : 'HIDE');
	
	model.addSetting_DropDown('FRAME:<br/>' + displayName, id, 'UI', ['SHOW', 'HIDE'], showByDefault ? 0 : 1)
}
