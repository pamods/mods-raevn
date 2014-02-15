//==============================
// rUnitDatabase - Unit Database
//------------------------------
// rUnitDatabase_start.js
// Created by Raevn
// Version 1.0.0 (2014/02/15)
//------------------------------

model.unitBlueprints_basicBots = ko.observable([]);
model.unitBlueprints_advancedBots = ko.observable([]);
model.unitBlueprints_basicVehicles = ko.observable([]);
model.unitBlueprints_advancedVehicles = ko.observable([]);
model.unitBlueprints_basicAircraft = ko.observable([]);
model.unitBlueprints_advancedAircraft = ko.observable([]);
model.unitBlueprints_basicNaval = ko.observable([]);
model.unitBlueprints_advancedNaval = ko.observable([]);
model.unitBlueprints_basicOrbital = ko.observable([]);
model.unitBlueprints_advancedOrbital = ko.observable([]);
model.unitBlueprints_basicStructures = ko.observable([]);
model.unitBlueprints_advancedStructures = ko.observable([]);
model.unitBlueprints_commanders = ko.observable([]);
model.unitBlueprints_other = ko.observable([]);

model.showOtherUnits = ko.observable(false);

model.showUnitDatabase = ko.observable(false);
model.selectedUnitBlueprintID = ko.observable("");
model.selectedType = ko.observable("");

model.showUnitInfo = ko.computed(function() {return model.selectedUnitBlueprintID() != "" });
model.showTypeInfo = ko.computed(function() {return model.selectedType() != "" });

model.selectedUnitVisionUnderwater = ko.observable();
model.selectedUnitVisionSurface = ko.observable();
model.selectedUnitVisionOrbital = ko.observable();
model.selectedUnitVisionCelestial = ko.observable();
model.selectedUnitRadarUnderwater = ko.observable();
model.selectedUnitRadarSurface = ko.observable();
model.selectedUnitRadarOrbital = ko.observable();
model.selectedUnitRadarCelestial = ko.observable();
model.selectedUnitHasVision = ko.observable();
model.selectedUnitHasRadar = ko.observable();

model.selectedTypeBlueprints = ko.computed(function() {
	if (model.selectedType() != "") {
		var blueprintIDs = bif.getBuildableUnitIDsFromArray(bif.getFilteredUnitIDs(model.selectedType()));
		if ($.inArray("base_commander", blueprintIDs) > -1) {
			blueprintIDs.splice($.inArray("base_commander", blueprintIDs), 1);
		}
		return bif.getBlueprintIDsFromBlueprints(bif.sortBlueprintsByAttribute(bif.getUnitBlueprintsFromArray(blueprintIDs), "display_name", "text", true));
	} else {
		return [];
	}
});

model.selectedUnitBlueprint = ko.computed(function() {
	if (model.selectedUnitBlueprintID() != "") {
		var unitBlueprint = bif.getUnitBlueprintInline(model.selectedUnitBlueprintID());
		model.selectedUnitVisionUnderwater(null);
		model.selectedUnitVisionSurface(null);
		model.selectedUnitVisionOrbital(null);
		model.selectedUnitVisionCelestial(null);
		model.selectedUnitRadarUnderwater(null);
		model.selectedUnitRadarSurface(null);
		model.selectedUnitRadarOrbital(null);
		model.selectedUnitRadarCelestial(null);
		
		if (unitBlueprint.recon && unitBlueprint.recon.observer && unitBlueprint.recon.observer.items) {
			for (var i = 0; i < unitBlueprint.recon.observer.items.length; i++) {
				var reconItem = unitBlueprint.recon.observer.items[i];
				if (reconItem.channel == "sight") {
					switch (reconItem.layer) {
						case "celestial":
							model.selectedUnitVisionCelestial(reconItem);
							break;
						case "orbital":
							model.selectedUnitVisionOrbital(reconItem);
							break;
						case "surface_and_air":
							model.selectedUnitVisionSurface(reconItem);
							break;
					}
				} 
				if (reconItem.channel == "radar") {
					switch (reconItem.layer) {
						case "celestial":
							model.selectedUnitRadarCelestial(reconItem);
							break;
						case "orbital":
							model.selectedUnitRadarOrbital(reconItem);
							break;
						case "surface_and_air":
							model.selectedUnitRadarSurface(reconItem);
							break;
					}
				} 
			}
		}
		model.selectedUnitHasVision(model.selectedUnitVisionOrbital() || model.selectedUnitVisionSurface() || model.selectedUnitVisionUnderwater() || model.selectedUnitVisionCelestial());
		model.selectedUnitHasRadar(model.selectedUnitRadarOrbital() || model.selectedUnitRadarSurface() || model.selectedUnitRadarUnderwater() || model.selectedUnitRadarCelestial());
		return unitBlueprint;
	} else {
		return {};
	}
});

model.selectedUnitTypes = ko.computed(function() {
	if (model.selectedUnitBlueprintID() != "") {
		if (model.selectedUnitBlueprint().unit_types != null) {
			return model.selectedUnitBlueprint().unit_types.map(function(unit_type) { 
				return unit_type.substring(9, unit_type.length);
			}).filter(function (el) {
				return el.substring(0,1) != "_";
			});
		} else {
			return [];
		}
	} else {
		return [];
	}
});

model.selectedUnitBuiltBy = ko.computed(function() {
	if (model.selectedUnitBlueprintID() != "") {
		var blueprints = bif.getBuildableUnitIDsFromArray(bif.getUnitBuiltByUnitIDs(model.selectedUnitBlueprintID()));
		
		if (bif.getUnitIDIsBuiltBy(model.selectedUnitBlueprintID(), "imperial_delta") == true) {
			blueprints = blueprints.concat(bif.getFilteredUnitIDs("Commander"));
			blueprints.splice(blueprints.indexOf("base_commander"), 1);
		}
		return blueprints;
	} else {
		return [];
	}
});


model.selectedUnitBuilds = ko.computed(function() {
	if (model.selectedUnitBlueprintID() != "") {
		return bif.getBuildableUnitIDsFromArray(bif.getUnitBuildableTypeUnitIDs(model.selectedUnitBlueprintID()));
	} else {
		return [];
	}
});

model.selectedUnitBuildArm = ko.computed(function() {
	if (model.selectedUnitBlueprintID() != "") {
		var buildArms = bif.getUnitBlueprintBuildArmIDs(model.selectedUnitBlueprintID());
		return buildArms[0];
	} else {
		return null;
	}
});

model.selectedUnitBuildArmMetalDemand = ko.computed(function() {
	if (model.selectedUnitBuildArm() != null) {
		return bif.getToolBlueprint(model.selectedUnitBuildArm()).construction_demand.metal;
	} else {
		return null;
	}
});

model.selectedUnitBuildArmMetalDemandOfBuilder = function(unitID) {
	if (model.selectedUnitBlueprintID() != "") {
		var buildArms = bif.getUnitBlueprintBuildArmIDs(unitID);
		return bif.getToolBlueprint(buildArms[0]).construction_demand.metal;
	} else {
		return null;
	}
}

model.selectedUnitWeapons = ko.computed(function() {
	if (model.selectedUnitBlueprintID() != "") {
		var unitWeapons = bif.getUnitBlueprintWeaponIDs(model.selectedUnitBlueprintID());
		var unitWeaponsBlueprint = [];
		for (var i = 0; i < unitWeapons.length; i++) {
			unitWeaponsBlueprint[i] = bif.getToolBlueprint(unitWeapons[i]);
		}
		return unitWeaponsBlueprint;
	} else {
		return [];
	}
});

model.selectedUnitHasBuilds = ko.computed(function() {return model.selectedUnitBuilds().length > 0});
model.selectedUnitHasBuiltBy = ko.computed(function() {return model.selectedUnitBuiltBy().length > 0});

model.selectedUnitHasFiringCue = ko.computed(function() {
	if (model.selectedUnitBlueprintID() != "") {
		if (model.selectedUnitBlueprint().events) {
			return model.selectedUnitBlueprint().events.firing != null;
		} else {
			return false;
		}
	} else {
		return false;
	}
});

getSortedFilteredUnitList = function(filter) {
	return bif.getBlueprintsArray(bif.sortBlueprintsByBuildOrder(bif.getUnitBlueprintsFromArray(bif.getBuildableUnitIDsFromArray(bif.getFilteredUnitIDs(filter)))));
}

getSortedUnitListUnbuildable = function(blueprints) {
	var unbuildableBlueprints = [];
	
	for (var i = 0; i < blueprints.length; i++) {
		if (bif.getUnitIDIsBuildable(blueprints[i]) == false && (bif.unitHasType(blueprints[i], "UNITTYPE_Commander") == false || blueprints[i] == "base_commander")) {
			unbuildableBlueprints.push(blueprints[i]);
		}
	}
	
	return bif.getBlueprintsArray(bif.getUnitBlueprintsFromArray(unbuildableBlueprints));
}

bif.registerBIFReadyCallback(function() {
	model.unitBlueprints_basicBots(getSortedFilteredUnitList("Bot & Basic & Mobile"));
	model.unitBlueprints_advancedBots(getSortedFilteredUnitList("Bot & Advanced & Mobile"));
	model.unitBlueprints_basicVehicles(getSortedFilteredUnitList("Tank & Basic & Mobile"));
	model.unitBlueprints_advancedVehicles(getSortedFilteredUnitList("Tank & Advanced & Mobile"));
	model.unitBlueprints_basicAircraft(getSortedFilteredUnitList("Air & Basic & Mobile"));
	model.unitBlueprints_advancedAircraft(getSortedFilteredUnitList("Air & Advanced & Mobile"));
	model.unitBlueprints_basicNaval(getSortedFilteredUnitList("Naval & Basic & Mobile"));
	model.unitBlueprints_advancedNaval(getSortedFilteredUnitList("Naval & Advanced & Mobile"));
	model.unitBlueprints_basicOrbital(getSortedFilteredUnitList("Orbital & Basic & Mobile"));
	model.unitBlueprints_advancedOrbital(getSortedFilteredUnitList("Orbital & Advanced & Mobile"));
	model.unitBlueprints_basicStructures(getSortedFilteredUnitList("CmdBuild | FabBuild | CombatFabBuild | (Structure & Basic)"));
	model.unitBlueprints_advancedStructures(getSortedFilteredUnitList("Structure & FabAdvBuild - (Structure & FabBuild) | (Structure & Advanced)"));
	
	var commanders = bif.getUnitBlueprintsFromArray(bif.getFilteredUnitIDs("Commander"));
	delete commanders["base_commander"];
	commanders = bif.getBlueprintsArray(bif.sortBlueprintsByBuildOrder(commanders));
	model.unitBlueprints_commanders(commanders);

	model.unitBlueprints_other(getSortedUnitListUnbuildable(bif.getUnitIDs()));
});

$('#A11').parent().parent().parent().before('<tr><td class="td_start_menu_item" data-bind="click: function () { model.showUnitDatabase(!model.showUnitDatabase())}"><span class="link_start_menu_item"><a href="#" id="A8" data-bind="click_sound: \'default\', rollover_sound: \'default\'"><span class="start_menu_item_lbl" >UNIT DATABASE</span></a></span></td></tr>');

$.get("coui://ui/mods/rUnitDatabase/rUnitDatabase.html", function (data) {$(".fadeContainer").append(data); ko.applyBindings(model, document.getElementById("unitDatabase"));});


