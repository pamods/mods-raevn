function initialSettingValue(id, value) {
	var s = decode(localStorage.settings);
	
	s[id] = s[id] ? s[id] : value;

	localStorage.settings = encode(s);
}