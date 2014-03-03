//==============================
// rUnitDatabase - Unit Database
//------------------------------
// rUnitDatabase_start.js
// Created by Raevn
// Version 1.2.0 (2014/03/03)
//------------------------------

loadScript("coui://ui/mods/rUnitDatabase/underscore-min.js");
loadScript("coui://ui/mods/rUnitDatabase/backbone-min.js");
loadScript("coui://ui/mods/rUnitDatabase/pretty-json-min.js");

//Blueprint Data
model.ud = {};
model.ud.basicBots = ko.observable([]);
model.ud.advancedBots = ko.observable([]);
model.ud.basicVehicles = ko.observable([]);
model.ud.advancedVehicles = ko.observable([]);
model.ud.basicAircraft = ko.observable([]);
model.ud.advancedAircraft = ko.observable([]);
model.ud.basicNaval = ko.observable([]);
model.ud.advancedNaval = ko.observable([]);
model.ud.basicOrbital = ko.observable([]);
model.ud.advancedOrbital = ko.observable([]);
model.ud.basicStructures = ko.observable([]);
model.ud.advancedStructures = ko.observable([]);
model.ud.commanders = ko.observable([]);
model.ud.other = ko.observable([]);

//Selected Type Data
model.ud.selectedType = ko.observable(null);
model.ud.selectedTypeBlueprints = ko.computed(function() {
	if (model.ud.selectedType() == null) {
		return [];
	}
	var blueprintIDs = bif.getBuildableUnitIDsFromArray(bif.getFilteredUnitIDs(model.ud.selectedType()));
	if ($.inArray("base_commander", blueprintIDs) > -1) {
		blueprintIDs.splice($.inArray("base_commander", blueprintIDs), 1);
	}
	if ($.inArray("imperial_base", blueprintIDs) > -1) {
		blueprintIDs.splice($.inArray("imperial_base", blueprintIDs), 1);
	}
	if ($.inArray("quad_base", blueprintIDs) > -1) {
		blueprintIDs.splice($.inArray("quad_base", blueprintIDs), 1);
	}
	if ($.inArray("tank_base", blueprintIDs) > -1) {
		blueprintIDs.splice($.inArray("tank_base", blueprintIDs), 1);
	}
	if ($.inArray("raptor_base", blueprintIDs) > -1) {
		blueprintIDs.splice($.inArray("raptor_base", blueprintIDs), 1);
	}
	return bif.getBlueprintIDsFromBlueprints(bif.sortBlueprintsByAttribute(bif.getUnitBlueprintsFromArray(blueprintIDs), "display_name", "text", true));
});

//Selected Unit Data
model.ud.selectedUnitBlueprintID = ko.observable(null);
model.ud.selectedUnitBlueprint = ko.computed(function() {
	if (model.ud.selectedUnitBlueprintID() == null) {
		return {};
	}
	
	var unitBlueprint = bif.getUnitBlueprintInline(model.ud.selectedUnitBlueprintID());
	
	var reconData = {
		"observer": {
			"radar": {
				"celestial": 0,
				"orbital": 0,
				"surface_and_air": 0
			},
			"sight": {
				"celestial": 0,
				"orbital": 0,
				"surface_and_air": 0
			},
		},
		"observable": {
			"ignore_sight" : false
		}
	};
	
	if (unitBlueprint.recon != null) {
		if(unitBlueprint.recon.observable != null) {
			reconData["observable"].ignore_sight = unitBlueprint.recon.observable.ignore_sight;
		}
		if (unitBlueprint.recon.observer != null) {
			if (unitBlueprint.recon.observer.items != null) {
				for (var i = 0; i < unitBlueprint.recon.observer.items.length; i++) {
					var reconItem = unitBlueprint.recon.observer.items[i];
					reconData["observer"][reconItem.channel][reconItem.layer] = reconItem.radius;
				}
			}
		}
	}
	model.ud.selectedUnitRecon(reconData);
	model.ud.selectedUnitHasVision(model.ud.selectedUnitRecon()["observer"]["sight"].surface_and_air > 0 || model.ud.selectedUnitRecon()["observer"]["sight"].orbital > 0 || model.ud.selectedUnitRecon()["observer"]["sight"].celestial > 0);
	model.ud.selectedUnitHasRadar(model.ud.selectedUnitRecon()["observer"]["radar"].surface_and_air > 0 || model.ud.selectedUnitRecon()["observer"]["radar"].orbital > 0 || model.ud.selectedUnitRecon()["observer"]["radar"].celestial > 0);
	model.ud.selectedUnitHasObservable(model.ud.selectedUnitRecon()["observable"].ignore_sight);
	model.ud.selectedUnitWreckageFrac(0.5);
	if (unitBlueprint.wreckage_health_frac != null) {
		model.ud.selectedUnitWreckageFrac(unitBlueprint.wreckage_health_frac);
	}
	
	model.ud.selectedUnitBlueprintRaw();
	
	return unitBlueprint;
});

model.ud.selectedUnitBlueprintRaw = function() { 
	var node = new PrettyJSON.view.Node({el:$('#rawBlueprint'),data:bif.sortBlueprintAlphabetically(bif.getUnitBlueprint(model.ud.selectedUnitBlueprintID()))}); 
	node.expandAll();
};

model.ud.selectedUnitWreckageFrac = ko.observable();
model.ud.selectedUnitRecon = ko.observable();
model.ud.selectedUnitHasVision = ko.observable();
model.ud.selectedUnitHasRadar = ko.observable();
model.ud.selectedUnitHasObservable = ko.observable();

model.ud.selectedUnitTypes = ko.computed(function() {
	if (model.ud.selectedUnitBlueprintID() == null) {
		return [];
	}
	
	if (model.ud.selectedUnitBlueprint().unit_types != null) {
		return model.ud.selectedUnitBlueprint().unit_types.map(function(unit_type) { 
			return unit_type.substring(9, unit_type.length);
		}).filter(function (el) {
			return el.substring(0,1) != "_";
		});
	}
});

model.ud.selectedUnitBuiltBy = ko.computed(function() {
	if (model.ud.selectedUnitBlueprintID() == null) {
		return [];
	}
	
	var blueprints = bif.getBuildableUnitIDsFromArray(bif.getUnitBuiltByUnitIDs(model.ud.selectedUnitBlueprintID()));
	
	if (bif.getUnitIDIsBuiltBy(model.ud.selectedUnitBlueprintID(), "imperial_delta") == true) {
		blueprints = blueprints.concat(bif.getFilteredUnitIDs("Commander"));
		blueprints.splice(blueprints.indexOf("base_commander"), 1);
		blueprints.splice(blueprints.indexOf("imperial_base"), 1);
		blueprints.splice(blueprints.indexOf("quad_base"), 1);
		blueprints.splice(blueprints.indexOf("raptor_base"), 1);
		blueprints.splice(blueprints.indexOf("tank_base"), 1);
	}
	return blueprints;
});


model.ud.selectedUnitBuilds = ko.computed(function() {
	if (model.ud.selectedUnitBlueprintID() == null) {
		return [];
	}
	return bif.getBuildableUnitIDsFromArray(bif.getUnitBuildableTypeUnitIDs(model.ud.selectedUnitBlueprintID()));
});

model.ud.selectedUnitBuildArm = ko.computed(function() {
	if (model.ud.selectedUnitBlueprintID() == null) {
		return null;
	}
	
	var buildArms = bif.getUnitBlueprintBuildArmIDs(model.ud.selectedUnitBlueprintID());
	return buildArms[0];
});

model.ud.selectedUnitBuildArmMetalDemand = ko.computed(function() {
	if (model.ud.selectedUnitBlueprintID() == null || model.ud.selectedUnitBuildArm() == null) {
		return null;
	}
	return bif.getToolBlueprint(model.ud.selectedUnitBuildArm()).construction_demand.metal;
});

model.ud.selectedUnitBuildArmMetalDemandOfBuilder = function(unitID) {
	if (model.ud.selectedUnitBlueprintID() == null) {
		return null;
	}
	
	var buildArms = bif.getUnitBlueprintBuildArmIDs(unitID);
	
	if (bif.getToolBlueprint(buildArms[0])!= null) {
		return bif.getToolBlueprint(buildArms[0]).construction_demand.metal;
	}
	return null;
}

model.ud.selectedUnitWeapons = ko.computed(function() {
	if (model.ud.selectedUnitBlueprintID() == null) {
		return [];
	}
	var unitWeapons = bif.getUnitBlueprintWeaponIDs(model.ud.selectedUnitBlueprintID());
	var unitWeaponsBlueprint = [];
	for (var i = 0; i < unitWeapons.length; i++) {
		unitWeaponsBlueprint[i] = bif.getToolBlueprintInline(unitWeapons[i]);
	}
	return unitWeaponsBlueprint;
});

model.ud.selectedUnitHasBuilds = ko.computed(function() {return model.ud.selectedUnitBuilds().length > 0});
model.ud.selectedUnitHasBuiltBy = ko.computed(function() {return model.ud.selectedUnitBuiltBy().length > 0});

model.ud.selectedUnitHasFiringCue = ko.computed(function() {
	if (model.ud.selectedUnitBlueprintID() == null) {
		return false;
	}
	if (model.ud.selectedUnitBlueprint().events != null) {
		return model.ud.selectedUnitBlueprint().events.firing != null;
	}
});

getSortedFilteredUnitList = function(filter) {
	if (bif.getBIFReady() == false) {
		return [];
	}
	
	return bif.getBlueprintsArray(bif.sortBlueprintsByBuildOrder(bif.getUnitBlueprintsFromArray(bif.getBuildableUnitIDsFromArray(bif.getFilteredUnitIDs(filter)))));
}

getSortedUnitListUnbuildable = function(blueprints) {
	if (bif.getBIFReady() == false) {
		return [];
	}

	var unbuildableBlueprints = [];
	
	for (var i = 0; i < blueprints.length; i++) {
		if (bif.getUnitIDIsBuildable(blueprints[i]) == false && (bif.unitHasType(blueprints[i], "UNITTYPE_Commander") == false || blueprints[i] == "base_commander" || blueprints[i] == "imperial_base")) {
			unbuildableBlueprints.push(blueprints[i]);
		}
	}
	
	return bif.getBlueprintsArray(bif.getUnitBlueprintsFromArray(unbuildableBlueprints));
}

bif.registerBIFReadyCallback(function() {
	model.ud.basicBots(getSortedFilteredUnitList("Bot & Basic & Mobile"));
	model.ud.advancedBots(getSortedFilteredUnitList("Bot & Advanced & Mobile"));
	model.ud.basicVehicles(getSortedFilteredUnitList("Tank & Basic & Mobile"));
	model.ud.advancedVehicles(getSortedFilteredUnitList("Tank & Advanced & Mobile"));
	model.ud.basicAircraft(getSortedFilteredUnitList("Air & Basic & Mobile"));
	model.ud.advancedAircraft(getSortedFilteredUnitList("Air & Advanced & Mobile"));
	model.ud.basicNaval(getSortedFilteredUnitList("Naval & Basic & Mobile"));
	model.ud.advancedNaval(getSortedFilteredUnitList("Naval & Advanced & Mobile"));
	model.ud.basicOrbital(getSortedFilteredUnitList("Orbital & Basic & Mobile"));
	model.ud.advancedOrbital(getSortedFilteredUnitList("Orbital & Advanced & Mobile"));
	model.ud.basicStructures(getSortedFilteredUnitList("CmdBuild | FabBuild | CombatFabBuild | (Structure & Basic)"));
	model.ud.advancedStructures(getSortedFilteredUnitList("Structure & FabAdvBuild - (Structure & FabBuild) | (Structure & Advanced)"));
	
	var commanders = bif.getUnitBlueprintsFromArray(bif.getFilteredUnitIDs("Commander"));
	delete commanders["base_commander"];
	delete commanders["imperial_base"];
	delete commanders["tank_base"];
	delete commanders["raptor_base"];
	delete commanders["quad_base"];
	commanders = bif.getBlueprintsArray(bif.sortBlueprintsByBuildOrder(commanders));
	model.ud.commanders(commanders);

	model.ud.other(getSortedUnitListUnbuildable(bif.getUnitIDs()));


});

//Toggles
model.ud.showOtherUnits = ko.observable(false);
model.ud.showUnitDatabase = ko.observable(false);
model.ud.showUnitInfo = ko.computed(function() {return model.ud.selectedUnitBlueprintID() != null });
model.ud.showUnitInfoRaw = ko.observable(false);
model.ud.showTypeInfo = ko.computed(function() {return model.ud.selectedType() != null });

$('#navigation_items a:nth-child(5)').after('<a href="#" class="nav_item" data-bind="css: {nav_item_disabled: !model.BIFReady()}, click: function () { if (model.BIFReady()) {model.ud.showUnitDatabase(!model.ud.showUnitDatabase())}}, click_sound: \'default\', rollover_sound: \'default\'"><span class="nav_item_text" data-bind="css: {nav_item_text_disabled: !model.BIFReady()}">UNIT DATABASE<img style="float:right; margin-top: -12px;" data-bind="visible: !model.BIFReady() && !model.showingEULA()" src="coui://ui/mods/rBlueprintInfoFramework/img/loading.gif"></span></a>');

$.get("coui://ui/mods/rUnitDatabase/rUnitDatabase.html", function (data) {$("body").append(data); ko.applyBindings(model, document.getElementById("unitDatabase"));});
