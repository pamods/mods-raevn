model.BIFReady = ko.observable(bif.getBIFReady());
model.showingBIF = ko.observable(false);
model.inMainMenu = ko.computed(function () { return !model.inStartupSequence() && !model.showingEULA() && !model.inRegionSetup() && !model.showingBIF();});

bif.registerBIFReadyCallback(function() {
	model.BIFReady(true);
	model.showingBIF(false);
});
		
$('.fadeContainer').append(
	'<div id="div_popup_overlay" data-bind="visible: bif.showingBIF">' +
	    '<div class="div_popup">' +
			'<div class="div_popup_panel" style="border: 1px solid #888888;">' +
				'<img src="coui://ui/alpha/shared/img/loading.gif"><div class="div_popup_primary_msg">Loading Blueprint Information ...</div>' +
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

