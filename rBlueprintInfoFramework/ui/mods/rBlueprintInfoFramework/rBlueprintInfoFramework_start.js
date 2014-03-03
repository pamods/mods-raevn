//===================================================
// rBlueprintInfoFramework - Blueprint Info Framework
//---------------------------------------------------
// rBlueprintInfoFramework_start.js
// Created by Raevn
// Version 1.4.0 (2014/03/03)
//---------------------------------------------------

model.BIFReady = ko.observable(bif.getBIFReady());

bif.registerBIFReadyCallback(function() {
	model.BIFReady(true);
});

/*
$('#navigation_panel').append(
	'<div data-bind="visible: showingBIF" style="width:100%">' +
		'<div>Loading Blueprint Information ...</div>' +
		'<div data-bind="text: \'Units - \' + bif.loaded_units() + (bif.unit_count > 0 ? \' (\' +((bif.loaded_units() / bif.unit_count) * 100).toFixed(2) + \'%)\' : \'\')"></div>' +
		'<div data-bind="text: \'Tools - \' + bif.loaded_tools() + (bif.tool_count > 0 ? \' (\' +((bif.loaded_tools() / bif.tool_count) * 100).toFixed(2) + \'%)\' : \'\')"></div>' +
		'<div data-bind="text: \'Ammo - \' + bif.loaded_ammo() + (bif.ammo_count > 0 ? \'\ (\' +((bif.loaded_ammo() / bif.ammo_count) * 100).toFixed(2) + \'%)\' : \'\')"></div>' +
		'<div data-bind="text: \'Checking images - \' + bif.loaded_images()"></div>' +
	'</div>'
);	
*/

if (model.BIFReady() == false) {
	if (model.showingEULA() == true) {
		model.showingEULA.subscribe(function(newValue) {
			if (newValue == false) {
				bif.initialiseBIF(false, true);
			}
		});
	} else {		
		bif.initialiseBIF(false, true);
	}
}
