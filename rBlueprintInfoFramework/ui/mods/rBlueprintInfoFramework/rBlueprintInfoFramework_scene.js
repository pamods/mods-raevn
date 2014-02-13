model.BIFReady = ko.observable(bif.getBIFReady());

bif.registerBIFReadyCallback(function() {
	model.BIFReady(true);
});

if (model.BIFReady() == false) {
	bif.initialiseBIF(false, true);
}