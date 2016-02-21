//==============================
// rUnitDatabase - Unit Database
//------------------------------
// rUnitDatabase_start.js
// Created by Raevn
// Version 1.2.0 (2014/03/03)
//------------------------------

loadScript("coui://ui/mods/rUnitDatabase/rUnitDatabase_base.js");

$('#navigation_items div:nth-child(5)').after('<div class="nav_item nav_item_text btn_std_ix" data-bind="css: {nav_item_disabled: !model.BIFReady()}, click: function () { if (model.BIFReady()) {model.ud.showUnitDatabase(!model.ud.showUnitDatabase())}}, click_sound: \'default\', rollover_sound: \'default\'">UNIT DATABASE<img style="float:right; margin-top: -12px;" data-bind="visible: !model.BIFReady()" src="coui://ui/mods/rBlueprintInfoFramework/img/loading.gif"></div>');

$.get("coui://ui/mods/rUnitDatabase/rUnitDatabase.html", function (data) {$("body").append(data); ko.applyBindings(model, document.getElementById("unitDatabase"));});
