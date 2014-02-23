//===================================================
// rBlueprintInfoFramework - Blueprint Info Framework
//---------------------------------------------------
// rBlueprintInfoFramework_scene.js
// Created by Raevn
// Version 1.3.0 (2014/02/23)
//---------------------------------------------------

model.BIFReady = ko.observable(bif.getBIFReady());

bif.registerBIFReadyCallback(function() {
	model.BIFReady(true);
});

if (model.BIFReady() == false) {
	bif.initialiseBIF(false, true);
}