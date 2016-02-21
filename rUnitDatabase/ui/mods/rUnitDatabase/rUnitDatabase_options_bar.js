//==============================
// rUnitDatabase - Unit Database
//------------------------------
// rUnitDatabase_start.js
// Created by Raevn
// Version 1.2.0 (2014/03/03)
//------------------------------

loadScript("coui://ui/mods/rUnitDatabase/rUnitDatabase_base.js");

model.udbloaded = ko.observable(false);

handlers.udbloaded = function(payload){
  model.udbloaded(payload);
}

model.openudb = function() {
  api.Panel.message("LiveGame_FloatZone","udbopen", true);
}

$(".div_ingame_options_bar_cont").prepend('<div class="btn_ingame_options" data-bind="click: function () { if (model.udbloaded()) {model.openudb()}}, click_sound: \'default\', rollover_sound: \'default\'">UDB<img style="float:right; height:10px;" data-bind="visible: !model.udbloaded()" src="coui://ui/mods/rBlueprintInfoFramework/img/loading.gif"></div>');

