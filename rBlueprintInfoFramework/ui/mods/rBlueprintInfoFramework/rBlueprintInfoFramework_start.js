//===================================================
// rBlueprintInfoFramework - Blueprint Info Framework
//---------------------------------------------------
// rBlueprintInfoFramework_start.js
// Created by Raevn
// Version 1.3.0 (2014/02/23)
//---------------------------------------------------

model.BIFReady = ko.observable(bif.getBIFReady());
model.showingBIF = ko.observable(false);
model.inMainMenu = ko.computed(function () { return !model.inStartupSequence() && !model.showingEULA() && !model.inRegionSetup() && !model.showingBIF();});

bif.registerBIFReadyCallback(function() {
	model.BIFReady(true);
	model.showingBIF(false);
});
		
$('body').append(
	'<div id="div_popup_overlay" data-bind="visible: showingBIF">' +
	    '<div class="div_popup">' +
			'<div class="div_popup_panel" style="border: 1px solid #888888;">' +
				'<img src="coui://ui/alpha/shared/img/loading.gif"><div class="div_popup_primary_msg">Loading Blueprint Information ...</div>' +
				'<div data-bind="text: \'Units - \' + bif.loaded_units() + (bif.unit_count > 0 ? \' (\' + (bif.loaded_units() / bif.unit_count) * 100 + \'%)\' : \'\')"></div>' +
				'<div data-bind="text: \'Tools - \' + bif.loaded_tools() + (bif.tool_count > 0 ? \' (\' + (bif.loaded_tools() / bif.tool_count) * 100 + \'%)\' : \'\')"></div>' +
				'<div data-bind="text: \'Ammo - \' + bif.loaded_ammo() + (bif.ammo_count > 0 ? \'\ (\' + (bif.loaded_ammo() / bif.ammo_count) * 100 + \'%)\' : \'\')"></div>' +
				'<div data-bind="text: \'Checking images - \' + bif.loaded_images()"></div>' +
			'</div>' +
		'</div>' + 
	'</div>'
);	

if (model.BIFReady() == false) {
	if (model.showingEULA() == true) {
		model.showingEULA.subscribe(function(newValue) {
			if (newValue == false) {
				model.showingBIF(true);
				
				bif.initialiseBIF(false, true);
			}
		});
	} else {
		model.showingBIF(true);
		
		bif.initialiseBIF(false, true);
	}
}

