//===================================================
// rBlueprintInfoFramework - Blueprint Info Framework
//---------------------------------------------------
// rBlueprintInfoFramework_scene.js
// Created by Raevn
// Version 1.4.0 (2014/03/03)
//---------------------------------------------------

model.BIFReady = ko.observable(bif.getBIFReady());

bif.registerBIFReadyCallback(function() {
	model.BIFReady(true);
});

if (model.BIFReady() == false) {
	bif.initialiseBIF(false, true);
}