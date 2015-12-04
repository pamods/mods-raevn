//===================================================
// rBlueprintInfoFramework - Blueprint Info Framework
//---------------------------------------------------
// rBlueprintInfoFramework.js
// Created by Raevn
// Version 1.4.3 (2014/09/21)
//---------------------------------------------------

var bif = {};
bif.bifReadyCallbacks = [];
bif.MAX_FILECHECK_QUEUE = 50;

if (decode(sessionStorage.bif) != null) {
	console.log("[Blueprint Info Framework] Blueprint info found in session storage");
	bif = decode(sessionStorage.bif);
	bif.loaded_units = ko.observable(bif.unit_count);
	bif.loaded_tools = ko.observable(bif.tool_count);
	bif.loaded_ammo = ko.observable(bif.ammo_count);
	bif.loaded_images = ko.observable(bif.image_count);
} else {
	console.log("[Blueprint Info Framework] Blueprint info not found in session storage");
	bif.initialised = false;
	
	bif.unit_list = {};
	bif.units = {};
	bif.units_id = [];
	bif.unit_count = 0;
	bif.loaded_units = ko.observable(0);
	
	bif.tools = {};
	bif.tools_id = [];
	bif.tool_count = 0;
	bif.loaded_tools = ko.observable(0);
	
	bif.ammo = {};
	bif.ammo_id = [];
	bif.ammo_count = 0;
	bif.loaded_ammo = ko.observable(0);
	
	bif._unit_buildable_types = {};
	bif._unit_built_by = {};
	bif._buildable_units = {};
	
	bif.fileExistsQueue = [];
	bif.fileExistsProcessCount = 0;
	bif.image_count = 0;
	bif.loaded_images = ko.observable(0);
}

bif.loadJSONdata = function(src) {
	var jsonXMLHttpRequestObject = new XMLHttpRequest();
	
    try
    {
        jsonXMLHttpRequestObject.open('GET', src, false);
        jsonXMLHttpRequestObject.send('');
    }
    catch( err )
    {
        console.log(err)
        return;
    }
    return JSON.parse(jsonXMLHttpRequestObject.responseText);
}

bif.queueFileExists = function(src, callback) {
	//console.log("[Blueprint Info Framework] File added to FileExists queue");
	bif.fileExistsQueue.push({"src": src, "callback": callback});
	bif.image_count++;
	
	if (bif.fileExistsQueue.length == 1) {
		//console.log("[Blueprint Info Framework] FileExists queue not empty, processing");
		bif.processFileExistsQueue();
	}
}

bif.processFileExistsQueue = function() {
	//console.log("[Blueprint Info Framework] FileExists queue size: " + bif.fileExistsQueue.length + " (" + bif.fileExistsProcessCount + " processing)");
	if (bif.fileExistsQueue.length > 0 && bif.fileExistsProcessCount < bif.MAX_FILECHECK_QUEUE) {
		//console.log("[Blueprint Info Framework] Processing: " + bif.fileExistsQueue[0].src);
		bif.fileExists(bif.fileExistsQueue[0].src, bif.fileExistsQueue[0].callback);
		bif.fileExistsQueue.splice(0, 1);
	} else {
		//console.log("[Blueprint Info Framework] Queue full, waiting");
	}
	
	if (bif.fileExistsQueue.length > 0) {
		setTimeout(bif.processFileExistsQueue, 1);
	}
}

bif.fileExists = function(src, callback){
	bif.fileExistsProcessCount++;
	
    var jsonXMLHttpRequestObject = new XMLHttpRequest();
	
	jsonXMLHttpRequestObject.onreadystatechange = function() {
		if (jsonXMLHttpRequestObject.readyState == 4) {
			bif.fileExistsProcessCount--;
			bif.loaded_images(bif.loaded_images() + 1);
			callback(src, jsonXMLHttpRequestObject.status != 404 && jsonXMLHttpRequestObject.status != 0);
			
			if (bif.fileExistsQueue.length == 0 && bif.fileExistsProcessCount == 0) {
				console.log("[Blueprint Info Framework] FileExists queue cleared");
		
				if (bif.loaded_units() == bif.unit_count && bif.loaded_tools() == bif.tool_count && bif.loaded_ammo() == bif.ammo_count) {
					bif.initialised = true;
					bif.bifReady();
					sessionStorage.bif = encode(bif);
				}
			}
		}
	}
    try
    {
		jsonXMLHttpRequestObject.timeout = 5000;
		jsonXMLHttpRequestObject.open('HEAD', src, true);
		jsonXMLHttpRequestObject.send('');
    }
    catch( err ) 
	{
		bif.fileExistsProcessCount--;
		bif.loaded_images(bif.loaded_images() + 1);
		callback(src, false);
		
		if (bif.fileExistsQueue.length == 0 && bif.fileExistsProcessCount == 0) {
			console.log("[Blueprint Info Framework] FileExists queue cleared");
	
			if (bif.loaded_units() == bif.unit_count && bif.loaded_tools() == bif.tool_count && bif.loaded_ammo() == bif.ammo_count) {
				bif.initialised = true;
				bif.bifReady();
				sessionStorage.bif = encode(bif);
			}
		}
	}
}

bif.initialiseBIF = function(force, cacheBuildData) {
	
	if (force == true) {
		console.log("[Blueprint Info Framework] Force initialisation");
		bif.initialised = false;
		
		bif.unit_list = {};
		bif.units = {};
		bif.units_id = [];
		bif.unit_count = 0;
		bif.loaded_units = ko.observable(0);
		
		bif.tools = {};
		bif.tools_id = [];
		bif.tool_count = 0;
		bif.loaded_tools = ko.observable(0);
		
		bif.ammo = {};
		bif.ammo_id = [];
		bif.ammo_count = 0;
		bif.loaded_ammo = ko.observable(0);
	
		bif._unit_buildable_types = {};
		bif._unit_built_by = {};
		bif._buildable_units = {};
		
		bif.fileExistsQueue = [];
		bif.fileExistsProcessCount = 0;
		bif.image_count = 0;
		bif.loaded_images = ko.observable(0);
	}
	
	if (cacheBuildData == true) {
		bif.registerBIFReadyCallback(bif.generateBIFcache);
	}

	if (bif.initialised == true) {
		console.log("[Blueprint Info Framework] Already initialised");
		bif.bifReady();
	} else {
		console.log("[Blueprint Info Framework] Initialising");
				
		$.getJSON("coui://pa/units/unit_list.json", function (data) {
			bif.unit_list = data;
			var unitCount = bif.unit_list.units.length;
			bif.unit_count = unitCount
			console.log("[Blueprint Info Framework] Loading blueprints");
			for (var i = 0; i < unitCount; i++) {
				var currentUnitPath = bif.unit_list.units[i];
				var currentUnitID = currentUnitPath.substring(currentUnitPath.lastIndexOf("/") + 1, currentUnitPath.indexOf(".json"));
			
				bif.units_id.push(currentUnitID);
			
				if (bif.units[currentUnitID] == null) {
					bif.doUnitBlueprint(currentUnitPath, currentUnitID);
				}
			}
		});
	}
}

bif.doUnitBlueprint = function(currentUnitPath, currentUnitID) { 
	$.getJSON("coui:/" + currentUnitPath, function (data) {
		
		bif.units[currentUnitID] = bif.loadBlueprintInfoRecursive(data, currentUnitID, "units");
		if (bif.units[currentUnitID].unit_types != null) {
			bif.units[currentUnitID].unit_types.push("UNITTYPE__" + currentUnitID);
		}
		
		bif.units[currentUnitID].id = currentUnitID;
		bif.units[currentUnitID].path = currentUnitPath;
		//console.log(bif.units[currentUnitID].description);
		bif.units[currentUnitID].description = loc(bif.units[currentUnitID].description);
		bif.units[currentUnitID].display_name = loc(bif.units[currentUnitID].display_name);
		bif.units[currentUnitID].buildIndex = "" + (999 - bif.units[currentUnitID].display_group) + "" + (999 - bif.units[currentUnitID].display_index);
		
		var iconName = bif.units[currentUnitID].si_name ? bif.units[currentUnitID].si_name : currentUnitID;
		bif.queueFileExists("coui://ui/main/atlas/icon_atlas/img/strategic_icons/icon_si_" + iconName + ".png", function (src, exists) {
			bif.units[currentUnitID].strategicIcon = exists == true ? src : "coui://ui/main/atlas/icon_atlas/img/strategic_icons/icon_si_blip.png";
		});
		//console.log("Fetching " + currentUnitPath.replace(".json","_icon_buildbar.png"));
		bif.queueFileExists("coui://" + currentUnitPath.replace(".json","_icon_buildbar.png"), function (src, exists) {
			
			bif.units[currentUnitID].buildPicture = exists == true ? src : null;
		});
		
		bif.units[currentUnitID].inherited = [];
		
		bif.loaded_units(bif.loaded_units() + 1);
		
		//Load Tool Data
		
		if (data.tools != null) {
			bif.tool_count += data.tools.length;
			for (var i = 0; i < data.tools.length; i++) {
				var currentToolPath = data.tools[i].spec_id;
				var currentToolID = currentToolPath.substring(currentToolPath.lastIndexOf("/") + 1, currentToolPath.indexOf(".json"));
				bif.tools_id.push(currentToolID);
				
				if (bif.tools[currentToolID] == null) {
					bif.doToolBlueprint(currentToolPath, currentToolID);
				}
				
			}
		}
		
		
		if (bif.loaded_units() == bif.unit_count) {
			console.log("[Blueprint Info Framework] Completed loading unit blueprints (" + bif.unit_count + ")");
			
			if (bif.loaded_tools() == bif.tool_count && bif.loaded_ammo() == bif.ammo_count && bif.fileExistsQueue.length == 0 && bif.fileExistsProcessCount == 0) {
				bif.initialised = true;
				bif.bifReady();
				sessionStorage.bif = encode(bif);
			}
		}
	}).error(function() { 
		console.log("[Blueprint Info Framework] Error loading unit blueprint: " + currentUnitID);
		bif.loaded_units(bif.loaded_units() + 1);
	});
}

bif.doToolBlueprint = function(currentToolPath, currentToolID) { 
	$.getJSON("coui:/" + currentToolPath, function (data) {
		
		bif.tools[currentToolID] = bif.loadBlueprintInfoRecursive(data, currentToolID, "tools");
		bif.tools[currentToolID].id = currentToolID;
		bif.tools[currentToolID].path = currentToolPath;
		bif.tools[currentToolID].inherited = [];
		bif.loaded_tools(bif.loaded_tools() + 1);
		
		//Load Ammo Data
		
		if (data.ammo_id != null) {
			bif.ammo_count ++;
			var currentAmmoPath = data.ammo_id;
			if(_.isArray(currentAmmoPath)){
          currentAmmoPath = currentAmmoPath[0].id;
          var currentAmmoID = currentAmmoPath.substring(currentAmmoPath.lastIndexOf("/") + 1, currentAmmoPath.indexOf(".json"));
          
          bif.ammo_id.push(currentAmmoID);
          
          if (bif.ammo[currentAmmoID] == null) {
            bif.doAmmoBlueprint(currentAmmoPath, currentAmmoID);
          }
			}
			else{
          var currentAmmoID = currentAmmoPath.substring(currentAmmoPath.lastIndexOf("/") + 1, currentAmmoPath.indexOf(".json"));
          
          bif.ammo_id.push(currentAmmoID);
          
          if (bif.ammo[currentAmmoID] == null) {
            bif.doAmmoBlueprint(currentAmmoPath, currentAmmoID);
          }
			}
		}
		
		if (bif.loaded_tools() == bif.tool_count) {
			console.log("[Blueprint Info Framework] Completed loading tool blueprints (" + bif.tool_count + ")");
			if (bif.loaded_units() == bif.unit_count && bif.loaded_ammo() == bif.ammo_count && bif.fileExistsQueue.length == 0 && bif.fileExistsProcessCount == 0) {
				bif.initialised = true;
				bif.bifReady();
				sessionStorage.bif = encode(bif);
			}
		}
	});
}

bif.doAmmoBlueprint = function(currentAmmoPath, currentAmmoID) { 
	$.getJSON("coui:/" + currentAmmoPath, function (data) {
		
		//locAddNamespace('units');
		bif.ammo[currentAmmoID] = bif.loadBlueprintInfoRecursive(data, currentAmmoID, "ammo");
		bif.ammo[currentAmmoID].id = currentAmmoID;
		bif.ammo[currentAmmoID].path = currentAmmoPath;
		bif.ammo[currentAmmoID].description = loc(bif.ammo[currentAmmoID].description);
		bif.ammo[currentAmmoID].display_name = loc(bif.ammo[currentAmmoID].display_name);
		bif.ammo[currentAmmoID].inherited = [];
		bif.loaded_ammo(bif.loaded_ammo() + 1);

		if (bif.loaded_ammo() == bif.ammo_count) {
			console.log("[Blueprint Info Framework] Completed loading ammo blueprints (" + bif.ammo_count + ")");
			if (bif.loaded_units() == bif.unit_count && bif.loaded_tools() == bif.tool_count && bif.fileExistsQueue.length == 0 && bif.fileExistsProcessCount == 0) {
				bif.initialised = true;
				bif.bifReady();
				sessionStorage.bif = encode(bif);
			}
		}
	});
}

bif.loadBlueprintInfoRecursive = function(blueprintData, blueprintID, type) {
	var baseBlueprintData = {};
	
	if (blueprintData.base_spec != null) {
		var baseBlueprintID = blueprintData.base_spec.substring(blueprintData.base_spec.lastIndexOf("/") + 1, blueprintData.base_spec.indexOf(".json"));
		if (bif[type][baseBlueprintID] != null) {
			baseBlueprintData = bif[type][baseBlueprintID];
		} else {
			baseBlueprintData = bif.loadJSONdata("coui:/" + blueprintData.base_spec);
		}
		baseBlueprintData = bif.loadBlueprintInfoRecursive(baseBlueprintData, baseBlueprintID, type);
		blueprintData["inheritance"] = baseBlueprintData.inheritance;
		blueprintData["inheritance"].push(baseBlueprintID);
		
		//We've returned up the chain, so the result can be cached.
		if (bif[type][baseBlueprintID] == null) {
			bif[type][baseBlueprintID] = baseBlueprintData;
			bif[type][baseBlueprintID].id = baseBlueprintID;
			bif[type][baseBlueprintID].path = blueprintData.base_spec;
			bif[type][baseBlueprintID].inherited = [];
			if (type == "units") {
				if (bif[type][baseBlueprintID].unit_types != null) {
					bif[type][baseBlueprintID].unit_types.push("UNITTYPE__" + baseBlueprintID);
				}
				bif[type][baseBlueprintID].buildIndex = "" + (999 - bif[type][baseBlueprintID].display_group) + "" + (999 - bif[type][baseBlueprintID].display_index);
				
				var iconName = bif.units[baseBlueprintID].si_name ? bif.units[baseBlueprintID].si_name : baseBlueprintID;
				bif.queueFileExists("coui://ui/main/atlas/icon_atlas/img/strategic_icons/icon_si_" + iconName + ".png", function (src, exists) {
					bif[type][baseBlueprintID].strategicIcon = exists == true ? src : "coui://ui/main/atlas/icon_atlas/img/strategic_icons/icon_si_blip.png";
				});
        //FIX needed here
				bif.queueFileExists("coui://ui/main/game/live_game/img/build_bar/units/" + baseBlueprintID + ".png", function (src, exists) {
					bif[type][baseBlueprintID].buildPicture = exists == true ? src : null;
				});
			}
		}
	} else {
		blueprintData["inheritance"] = [];
	}
	
	var currentUnitData = bif.customExtend(blueprintData, baseBlueprintData);
	return currentUnitData;
}

bif.generateBIFcache = function() {
	console.log("[Blueprint Info Framework] Caching build data for unit blueprints");
	for (var i = 0; i < bif.unit_count; i++) {
		var currentUnitID = bif.units_id[i];
		if (bif.unitBlueprintExists(currentUnitID) == true) {
			if (bif.units[currentUnitID].buildable_types != null) {
				bif.getUnitBuildableTypeUnitIDs(currentUnitID);
			}
		}
	}
	for (var i = 0; i < bif.unit_count; i++) {
		var currentUnitID = bif.units_id[i];

		bif.getUnitBuiltByUnitIDs(currentUnitID);
	}
	
	for (var i = 0; i < bif.unit_count; i++) {
		var currentUnitID = bif.units_id[i];
		if (bif.unitBlueprintExists(currentUnitID) == true) {
			if (bif.units[currentUnitID].base_spec != null) {
				var baseBlueprintID = bif.getBlueprintIDFromPath(bif.units[currentUnitID].base_spec);
				bif.units[baseBlueprintID].inherited.push(currentUnitID);
			}
		}
	}
	
	for (var i = 0; i < bif.tool_count; i++) {
		var currentToolID = bif.tools_id[i];
		if (bif.toolBlueprintExists(currentToolID) == true) {
			if (bif.tools[currentToolID].base_spec != null) {
				var baseBlueprintID = bif.getBlueprintIDFromPath(bif.tools[currentToolID].base_spec);
				bif.tools[baseBlueprintID].inherited.push(currentToolID);
			}
		}
	}
	
	for (var i = 0; i < bif.ammo_count; i++) {
		var currentAmmoID = bif.ammo_id[i];
		if (bif.ammoBlueprintExists(currentAmmoID) == true) {
			if (bif.ammo[currentAmmoID].base_spec != null) {
				var baseBlueprintID = bif.getBlueprintIDFromPath(bif.ammo[currentAmmoID].base_spec);
				bif.ammo[baseBlueprintID].inherited.push(currentAmmoID);
			}
		}
	}
	
	bif.getBuildableUnitIDs();
	console.log("[Blueprint Info Framework] Completed caching build data for unit blueprints");
}

bif.bifReady = function() {
	console.log("[Blueprint Info Framework] Executing " + bif.bifReadyCallbacks.length + " ready callbacks");
	for (var i = 0; i < bif.bifReadyCallbacks.length; i++) {
		bif.bifReadyCallbacks[i]();
	}
}

bif.checkBIFReady = function(functionName) {
	if (bif.initialised == false) {
		console.log("[Blueprint Info Framework] " + functionName + ": Not yet initialised");
		return false;
	}
	return true;
}

bif.checkBIFBlueprintExists = function(functionName, blueprintType, blueprintID) {
	if (bif[blueprintType][blueprintID] == null) {
		console.log("[Blueprint Info Framework] " + functionName + ": Blueprint of type " + blueprintType + " with ID " + blueprintID + " does not exist");
		return false;
	}
	return true;
}

//Deep copy, except for arrays.
bif.customExtend = function(blueprint, baseBlueprint) {
	if (blueprint == null) {
		return baseBlueprint;
	}
	if (baseBlueprint == null) {
		return blueprint;
	}
	var finalBlueprint = $.extend(true, {}, baseBlueprint);
	
	for (var attribute in blueprint) {
		if (blueprint.hasOwnProperty(attribute)) {
			if (typeof blueprint[attribute] == "object" && !($.isArray(blueprint[attribute]))) {
				finalBlueprint[attribute] = bif.customExtend(blueprint[attribute], baseBlueprint[attribute]);
			} else if (blueprint[attribute] != null) {
				finalBlueprint[attribute] = blueprint[attribute];
			}
		}
	}
	return finalBlueprint;
};

bif.sortBIF = function(field, reverse, primer) {
	var key = primer ? function(x) {return primer(x[field])} : function(x) {return x[field]};
	reverse = [-1, 1][+!!reverse];
	
	return function (a, b) {
		if (key(a) == key(b)) {
			if (a.position < b.position) {
				return 1 * reverse;
			} else {
				return -1 * reverse;
			}
		} else {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		}
	} 
}

bif.getBlueprintsArray = function(blueprints) {
	if (bif.checkBIFReady("getBlueprintsArray") == false) {
		return null;
	}
		
	var blueprintsArray = $.map(blueprints, function(value, index) { return [value] });
			
	return blueprintsArray;
}

bif.getBlueprintsFromBlueprintsArray = function(blueprintsArray) {
	if (bif.checkBIFReady("getBlueprintsFromBlueprintsArray") == false) {
		return null;
	}
	
	var blueprints =  {};
	
	
	$.each(blueprintsArray, function(index, value) { 
		blueprints[value.id] = value;
	});
		
	return blueprints;
}





////*****************************////
//// General Framework Functions ////
////*****************************////

/*
registerBIFReadyCallback
------------------------
Adds a function to be called once BIF has finished loading.
Will execute functionCallback immediately if BIF has already finished loading.

Params:
	functionCallback: function

Returns:
	true
*/
bif.registerBIFReadyCallback = function(functionCallback) {
	if (bif.initialised == false) {
		bif.bifReadyCallbacks.push(functionCallback);
		console.log("[Blueprint Info Framework] Added ready callback");
	} else {
		console.log("[Blueprint Info Framework] Framework loaded, executing ready callback immediately");
		functionCallback();
	}
	return true;
}

/*
getBIFReady
-----------
Gets the currently loaded state of BIF

Params:
	none

Returns:
	boolean - whether BIF has finished loading
*/
bif.getBIFReady = function() {
	return bif.initialised;
}

/*
sortBlueprintAlphabetically
---------------------------
Sort a given blueprint by alphabetically order based on attribute names

Params:
	blueprint - (Associative Array) The blueprint to sort
	
Returns:
	associative array - the sorted blueprint
*/
bif.sortBlueprintAlphabetically = function(blueprint) {
	if (bif.checkBIFReady("sortBlueprintAlphabetically") == false) {
		return null;
	}
	
	var blueprintAsArray = $.map(blueprint, function(value, index) { return [index] });
	blueprintAsArray.sort();
	
	var sortedBlueprint = {};
	
	for (var i = 0; i < blueprintAsArray.length; i++) {
		sortedBlueprint[blueprintAsArray[i]] = blueprint[blueprintAsArray[i]];
	}
	
	return sortedBlueprint;
}

/*
sortBlueprintsByAttribute
-------------------------
Sort the given blueprints by the value of an attribute

Params:
	blueprints - (Associative Array) The list of blueprints to sort
	attribute - (text) The name of an attribute in the blueprint to sort by
	type - (Text) The type of sort to perform, valid values are "text" and "number"
	ascending - (Boolean) Whether to sort by ascending values (true) or descending (false) 

Returns:
	associative array - the provided blueprints, sorted. If an invalid type is given, the original associative array will be returned
*/
bif.sortBlueprintsByAttribute = function(blueprints, attribute, type, ascending) {
	if (bif.checkBIFReady("sortBlueprintsByAttribute") == false) {
		return null;
	}
	var blueprintsAsArray = bif.getBlueprintsArray(blueprints);
	
	switch (type) {
		case "number":
			blueprintsAsArray = blueprintsAsArray.sort(bif.sortBIF(attribute, ascending, parseInt));
			break;
		case "text":
			blueprintsAsArray = blueprintsAsArray.sort(bif.sortBIF(attribute, ascending, null));
			break;
	}
	return bif.getBlueprintsFromBlueprintsArray(blueprintsAsArray);
}

/*
getBlueprintIDsFromBlueprints
-----------------------------
Returns an array of blueprint IDs from a given associative array of blueprints

Params:
	blueprints - (Associative Array) The list of blueprints to turn into an array

Returns:
	array - the constructed array of unit IDs, built from the given blueprints associative array
*/
bif.getBlueprintIDsFromBlueprints = function(blueprints) {
	if (bif.checkBIFReady("getBlueprintIDsFromBlueprints") == false) {
		return null;
	}
	
	var blueprintsIDs = $.map(blueprints, function(value, index) { return [index] });
		
	return blueprintsIDs;
}

/*
getBlueprintIDFromPath
--------------------
Returns the blueprint ID from a given file path

Params:
	path - (Text) The file path of a unit.

Returns:
	text - the blueprint ID
*/
bif.getBlueprintIDFromPath = function(path) {
	if (bif.checkBIFReady("getBlueprintIDFromPath") == false) {
		return null;
	}
	
	return path.substring(path.lastIndexOf("/") + 1, path.indexOf(".json"));
}





////****************////
//// Unit Functions ////
////****************////

/*
unitBlueprintExists
-------------------
Check if a unit exists with a specified unit ID.

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
	boolean - whether a unit with the given unitID exists
*/
bif.unitBlueprintExists = function(unitID) {
	if (bif.checkBIFReady("unitBlueprintExists") == false) {
		return null;
	}
	
	return bif.units[unitID] != null;
}

/*
unitHasType
-----------
Check if a unit has a given type

Params:
	unitID - (Text) The ID of a unit blueprint
	type - (Text) The type to search for

Returns:
	null - a unit with the given unit ID does not exist
	boolean - whether a unit with the given unitID has the given type
*/
bif.unitHasType = function(unitID, type) {
	if (bif.checkBIFReady("unitHasType") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("unitHasType", "units", unitID) == false) {
		return null;
	}
	
	return $.inArray(type, bif.units[unitID].unit_types) > -1;
}

/*
getUnitBlueprintsFromArray
--------------------------
Returns an associative array of unit blueprints, built from an array of unit IDs

Params:
	unitIDArray - (Array - Text) The unit IDs to create an associative array from

Returns:
    null - unitIDArray is not an array
	associative array - the constructed associative array, consisting of all valid units from unitIDArray.
*/
bif.getUnitBlueprintsFromArray = function(unitIDArray) {
	if (bif.checkBIFReady("getUnitBlueprintsFromArray") == false) {
		return null;
	}
	
	if ($.isArray(unitIDArray) == false) {
		return null;
	}

	var unitBlueprints = {};
	
	for (var i = 0; i < unitIDArray.length; i++) {
		if (bif.unitBlueprintExists(unitIDArray[i]) == true) {
			unitBlueprints[unitIDArray[i]] = bif.units[unitIDArray[i]];
		}
	}
	
	return unitBlueprints;
}

/*
getUnitName
-----------
Get the name of a given unit

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
    null - a unit with the given unit ID does not exist
	text - the name of the unit with the given unit ID
*/
bif.getUnitName = function(unitID) {
	if (bif.checkBIFReady("getUnitName") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitName", "units", unitID) == false) {
		return null;
	}
	
	return bif.units[unitID].display_name;
}

/*
sortBlueprintsByBuildOrder
-------------------------
Sort the given blueprints by the order they appear in the build menu.

Params:
	blueprints - (Associative Array) The list of blueprints to sort

Returns:
	associative array - the provided blueprints, sorted.
*/
bif.sortBlueprintsByBuildOrder = function(blueprints) {
	blueprints = bif.sortBlueprintsByAttribute(blueprints, "path", "text", true);
	blueprints = bif.sortBlueprintsByAttribute(blueprints, "buildIndex", "number", true);
	
	return blueprints;
}

/*
getUnitBlueprint
----------------
Get the blueprint of the unit with the specified unitID

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
    null - a unit with the given unit ID does not exist
	associative array - the blueprint of the unit
*/
bif.getUnitBlueprint = function(unitID) {
	if (bif.checkBIFReady("getUnitBlueprint") == false) {
		return null;
	}

	if (bif.checkBIFBlueprintExists("getUnitBlueprint", "units", unitID) == false) {
		return null;
	}
	
	return bif.units[unitID];
}

/*
getUnitBlueprintInline
----------------------
Get the blueprint of the unit with the specified unitID, with tool and ammo blueprint data incorporated

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
    null - a unit with the given unit ID does not exist
	associative array - the blueprint of the unit
*/
bif.getUnitBlueprintInline = function(unitID) {
	if (bif.checkBIFReady("getUnitBlueprintInline") == false) {
		return null;
	}

	if (bif.checkBIFBlueprintExists("getUnitBlueprintInline", "units", unitID) == false) {
		return null;
	}
	
	var inlinedBlueprint = $.extend(true, {}, bif.units[unitID]);
	
	if (inlinedBlueprint.tools != null) {
		for (var i = 0; i < inlinedBlueprint.tools.length; i++) {
			if (inlinedBlueprint.tools[i].spec_id != null) {
				inlinedBlueprint.tools[i].spec_blueprint = bif.getToolBlueprintInline(bif.getBlueprintIDFromPath(inlinedBlueprint.tools[i].spec_id));
			}
		}
	}
	return inlinedBlueprint;
}

/*
getUnitBlueprints
-----------------
Get the blueprints of all units

Params:
	none

Returns:
	associative array - the blueprints of all units
*/
bif.getUnitBlueprints = function() {
	if (bif.checkBIFReady("getUnitBlueprints") == false) {
		return null;
	}
	
	return bif.units;
}

/*
getUnitIDs
----------
Get the unit IDs of all units

Params:
	none

Returns:
	array - the unit IDs of all units
*/
bif.getUnitIDs = function() {
	if (bif.checkBIFReady("getUnitIDs") == false) {
		return null;
	}
	
	return bif.units_id;
}

/*
getUnitBlueprintToolIDs
-----------------------
Get the tools IDs of all tools referenced in the blueprint of the unit with the specified unitID

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
    null - a unit with the given unit ID does not exist
	array - the tool IDs of all tools used by the specified unit
*/
bif.getUnitBlueprintToolIDs = function(unitID) {
	if (bif.checkBIFReady("getUnitBlueprintToolIDs") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitBlueprintToolIDs", "units", unitID) == false) {
		return null;
	}
	
	var unitTools = [];
	
	if (bif.units[unitID].tools != null) {
		for (var i = 0; i < bif.units[unitID].tools.length; i++) {
			var currentToolID = bif.getBlueprintIDFromPath(bif.units[unitID].tools[i].spec_id);
			unitTools.push(currentToolID);
		}
	}
	return unitTools;
}

/*
getUnitBlueprintTools
---------------------
Get the tool blueprints of all tools referenced in the blueprint of the unit with the specified unitID

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
    null - a unit with the given unit ID does not exist
	associative array - the blueprints of all tools used by the specified unit
*/
bif.getUnitBlueprintTools = function(unitID) {
	if (bif.checkBIFReady("getUnitBlueprintTools") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitBlueprintTools", "units", unitID) == false) {
		return null;
	}
	
	return bif.getToolBlueprintsByIDArray(bif.getUnitBlueprintToolIDs(unitID));
}

/*
getUnitBlueprintWeaponIDs
-------------------------
Get the weapon IDs of all weapons referenced in the blueprint of the unit with the specified unitID

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
    null - a unit with the given unit ID does not exist
	array - the weapon IDs of all weapons used by the specified unit
*/
bif.getUnitBlueprintWeaponIDs = function(unitID) {
	if (bif.checkBIFReady("getUnitBlueprintWeaponIDs") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitBlueprintWeaponIDs", "units", unitID) == false) {
		return null;
	}
	
	return bif.getUnitBlueprintToolIDs(unitID).filter(function (el) {
		return bif.tools[el].tool_type == "TOOL_Weapon";
	});
}

/*
getUnitBlueprintWeapons
-----------------------
Get the weapon blueprints of all weapons referenced in the blueprint of the unit with the specified unitID

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
    null - a unit with the given unit ID does not exist
	associative array - the blueprints of all weapons used by the specified unit
*/
bif.getUnitBlueprintWeapons = function(unitID) {
	if (bif.checkBIFReady("getUnitBlueprintWeapons") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitBlueprintWeapons", "unit", unitID) == false) {
		return null;
	}
	
	return bif.getToolBlueprintsByIDArray(bif.getUnitBlueprintWeaponIDs(unitID));
}

/*
getUnitBlueprintBuildArmIDs
---------------------------
Get the build arm IDs of all build arms referenced in the blueprint of the unit with the specified unitID

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
    null - a unit with the given unit ID does not exist
	array - the build arm IDs of all build arms used by the specified unit
*/
bif.getUnitBlueprintBuildArmIDs = function(unitID) {
	if (bif.checkBIFReady("getUnitBlueprintBuildArmIDs") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitBlueprintBuildArmIDs", "units", unitID) == false) {
		return null;
	}
	
	return bif.getUnitBlueprintToolIDs(unitID).filter(function (el) {
		return bif.tools[el].tool_type == "TOOL_BuildArm";
	});
}

/*
getUnitBlueprintBuildArms
-------------------------
Get the build arm blueprints of all build arms referenced in the blueprint of the unit with the specified unitID

Params:
	unitID - (Text) The ID of a unit blueprint

Returns:
    null - a unit with the given unit ID does not exist
	associative array - the blueprints of all build arms used by the specified unit
*/
bif.getUnitBlueprintBuildArms = function(unitID) {
	if (bif.checkBIFReady("getUnitBlueprintBuildArms") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitBlueprintBuildArms", "units", unitID) == false) {
		return null;
	}
	
	return bif.getToolBlueprintsByIDArray(bif.getUnitBlueprintBuildArmIDs(unitID));
}

/*
getFilteredUnitIDs
------------------
Get a list of unitIDs that match a given buildable_types filter

Params:
	filter - (Text) The filter to apply. Uses the same syntax as the buildable_types blueprint attribute

Returns:
	array - The Unit IDs that match the filter
*/
bif.getFilteredUnitIDs = function(filter) {
	if (bif.checkBIFReady("getFilteredUnitIDs") == false) {
		return null;
	}
	
	return bif.getFilteredUnitIDsFromArray(bif.getUnitIDs(), filter);
}

/*
getFilteredUnitIDsFromArray
---------------------------
Get a list of unitIDs within a provided array of unit IDs that match a given buildable_types filter

Params:
	unitIDArray - (Array) A list of unitIDs to filter
	filter - (Text) The filter to apply. Uses the same syntax as the buildable_types blueprint attribute

Returns:
	array - The Unit IDs that match the filter
*/
bif.getFilteredUnitIDsFromArray = function(unitIDArray, filter) {
	if (bif.checkBIFReady("getFilteredUnitIDsFromArray") == false) {
		return null;
	}
		
	filter = filter.replace(/\|/g, " | ");
	filter = filter.replace(/\&/g, " & ");
	filter = filter.replace(/\(/g, " ( ");
	filter = filter.replace(/\)/g, " ) ");
	filter = filter.replace(/\-/g, " - ");
	var filterTokens = filter.split(" ");
	for (var i = 0; i < filterTokens.length; i++) {
		if (filterTokens[i] != "(" && filterTokens[i] != ")" && filterTokens[i] != "|" && filterTokens[i] != "&" && filterTokens[i] != "-" && filterTokens[i] != "") {
			filterTokens[i] = "($.inArray('UNITTYPE_" + filterTokens[i] + "', unitTypes) > -1)";
		}
		
		if (filterTokens[i] == "-") {
			filterTokens[i] = "& !";
		}
		
	}
	var filterString = filterTokens.join("");
	var filterFunc = new Function('unitTypes', 'return ' + filterString);
	var filteredBlueprintIDs = unitIDArray.filter(function(el) { 
		if (bif.unitBlueprintExists(el) == true) {
			var currentUnitTypes = bif.units[el].unit_types;
			if (currentUnitTypes != null) { 
				return filterFunc(currentUnitTypes);
			}
		}
		return false;
	});
	
	return filteredBlueprintIDs;
}

/*
getFilteredUnitBlueprints
-------------------------
Get a list of unit blueprints that match a given buildable_types filter

Params:
	filter - (Text) The filter to apply. Uses the same syntax as the buildable_types blueprint attribute

Returns:
	array - The Unit Bluepritns that match the filter
*/
bif.getFilteredUnitBlueprints = function(filter) {
	if (bif.checkBIFReady("getFilteredUnitBlueprints") == false) {
		return null;
	}
	
	return bif.getFilteredUnitBlueprintsFromArray(bif.getUnitBlueprintIDs(), filter);
}

/*
getFilteredUnitBlueprintsFromArray
----------------------------------
Get a list of units within a provided array of unit IDs that match a given buildable_types filter

Params:
	unitIDArray - (Array) A list of unitIDs to filter
	filter - (Text) The filter to apply. Uses the same syntax as the buildable_types blueprint attribute

Returns:
	array - The Unit Blueprints that match the filter
*/
bif.getFilteredUnitBlueprintsFromArray = function(unitIDArray, filter) {
	if (bif.checkBIFReady("getFilteredUnitBlueprintsFromArray") == false) {
		return null;
	}
	
	return bif.getUnitBlueprintsFromArray(bif.getFilteredUnitIDsFromArray(unitIDArray, filter));
}

/*
getUnitBuildableTypeUnitIDs
---------------------------
Get all unit IDs that are built by a given unit ID

Params:
	unitID - (Text) The unitID of the builder unit

Returns:
	null - a unit with the given unit ID does not exist
	array - The Unit IDs that are built by the given unit ID
*/
bif.getUnitBuildableTypeUnitIDs = function(unitID) {
	if (bif.checkBIFReady("getUnitBuildableTypeUnitIDs") == false) {
		return null;
	}
		
	if (bif._unit_buildable_types[unitID] != null) {
		return bif._unit_buildable_types[unitID];
	} else {
	
		if (bif.checkBIFBlueprintExists("getUnitBuildableTypeUnitIDs", "units", unitID) == false) {
			return null;
		}
		
		
		var buildableTypesString = bif.units[unitID].buildable_types;
		if (buildableTypesString == null) {
			return [];
		} else if (bif._unit_buildable_types[buildableTypesString] != null) {
			bif._unit_buildable_types[unitID] = bif._unit_buildable_types[buildableTypesString];
			return bif._unit_buildable_types[unitID];
		} else {
			var result = bif.getFilteredUnitIDs(buildableTypesString);
			
			bif._unit_buildable_types[buildableTypesString] = result;
			bif._unit_buildable_types[unitID] = result;
			return result;
		}
	}
}

/*
getUnitBuildableTypeBlueprints
------------------------------
Get all unit blueprints that are built by a given unit ID

Params:
	unitID - (Text) The unitID of the builder unit

Returns:
	null - a unit with the given unit ID does not exist
	associative array - The unit blueprintss that are built by the given unit ID
*/
bif.getUnitBuildableTypeBlueprints = function(unitID) {
	if (bif.checkBIFReady("getUnitBuildableTypeBlueprints") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitBuildableTypeBlueprints", "units", unitID) == false) {
		return null;
	}
	
	return bif.getUnitBlueprintsFromArray(bif.getUnitBuildableTypeUnitIDs(unitID));
}

/*
getUnitBuiltByUnitIDs
---------------------
Get all unit IDs that can build a given unit

Params:
	unitID - (Text) The unitID of the unit

Returns:
	null - a unit with the given unit ID does not exist
	array - The unit IDs that can build the given unit
*/
bif.getUnitBuiltByUnitIDs = function(unitID) {
	if (bif.checkBIFReady("getUnitBuiltByUnitIDs") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitBuiltByUnitIDs", "units", unitID) == false) {
		return null;
	}
	
	if (bif._unit_built_by[unitID] != null) {
		return bif._unit_built_by[unitID];
	} else {
		var builtByIDs = [];
		
		for(var i = 0; i < bif.unit_count; i++) {
			var currentUnitID = bif.units_id[i];
			
			if (bif.unitBlueprintExists(currentUnitID) == true) {
				if (bif.units[currentUnitID].buildable_types != null) {
					var currentUnitBuildableTypes = bif.getUnitBuildableTypeUnitIDs(currentUnitID);
					if ($.inArray(unitID, currentUnitBuildableTypes) > -1) {
						builtByIDs.push(currentUnitID);
					}
				}
			}
		}
		
		bif._unit_built_by[unitID] = builtByIDs;
		return builtByIDs;
	}
}


/*
getUnitBuiltByBlueprints
------------------------
Get all unit blueprints that can build a given unit

Params:
	unitID - (Text) The unitID of the unit

Returns:
	null - a unit with the given unit ID does not exist
	associative array - The unit blueprint that can build the given unit
*/
bif.getUnitBuiltByBlueprints = function(unitID) {
	if (bif.checkBIFReady("getUnitBuiltByBlueprints") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitBuiltByBlueprints", "units", unitID) == false) {
		return null;
	}
	
	return bif.getUnitBlueprintsFromArray(bif.getUnitBuiltByBlueprintIDs(unitID));
}

/*
getUnitIDIsBuiltBy
------------------------
Returns whether the specified unitID is built by builderUnitID

Params:
	unitID - (Text) The unitID of the unit to be built
	builderUnitID - (Text) The unit on which to check whether it builds unitID or not

Returns:
	null - a unit with the given unitID or builderUnitID does not exist
	boolean - Whether builderUnitID can build unitID
*/
bif.getUnitIDIsBuiltBy = function(unitID, builderUnitID) {
	if (bif.checkBIFReady("getUnitIDIsBuiltBy") == false) {
		return null;
	}

	if (bif.checkBIFBlueprintExists("getUnitIDIsBuiltBy", "units", unitID) == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitIDIsBuiltBy", "units", builderUnitID) == false) {
		return null;
	}
	
	return $.inArray(builderUnitID, bif._unit_built_by[unitID]) > -1
}


/*
getUnitIDIsBuildable
--------------------
Returns whether the given unitID is buildable by baseBuilderUnitID or a unit that baseBuilderUnitID builds (recursive)

Params:
	unitID - (Text) The unit ID to check
	baseBuilderUnitID - (Text, optional) The base unit to determine buildability. Will default to "base_commander"

Returns:
    null - unitID or baseBuilderUnitID are not valid unit IDs
	boolean - whether the provided unitID is buildable or not.
*/
bif.getUnitIDIsBuildable = function(unitID, baseBuilderUnitID) {
	if (bif.checkBIFReady("getUnitIDIsBuildable") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getUnitIDIsBuildable", "units", unitID) == false) {
		return null;
	}
		
	baseBuilderUnitID = baseBuilderUnitID == null ? "base_commander" : baseBuilderUnitID;
	
	if (bif.checkBIFBlueprintExists("getUnitIDIsBuildable", "units", baseBuilderUnitID) == false) {
		return null;
	}
		
	var buildableUnitBlueprintIDs = bif.getBuildableUnitIDs(baseBuilderUnitID);
	return $.inArray(unitID, buildableUnitBlueprintIDs) > -1;
}

/*
getBuildableUnitIDsFromArray
----------------------------
Returns a filtered list of given unitIDs, only including those that are buildable by baseBuilderUnitID or a unit that baseBuilderUnitID builds (recursive)

Params:
	unitIDArray - (Array) The unit IDs to check
	baseBuilderUnitID - (Text, optional) The base unit to determine buildability. Will default to "base_commander"

Returns:
    null - baseBuilderUnitID is not a valid unit IDs
	array - the filtered list of unit IDs that are buildable
*/
bif.getBuildableUnitIDsFromArray = function(unitIDArray, baseBuilderUnitID) {
	if (bif.checkBIFReady("getBuildableUnitIDsFromArray") == false) {
		return null;
	}
	
	baseBuilderUnitID = baseBuilderUnitID == null ? "base_commander" : baseBuilderUnitID;
	
	if (bif.checkBIFBlueprintExists("getBuildableUnitIDsFromArray", "units", baseBuilderUnitID) == false) {
		return null;
	}
	
	
	
	return unitIDArray.filter(function(el) { 
		return bif.getUnitIDIsBuildable(el, baseBuilderUnitID);
	});
}


/*
getBuildableUnitIDs
-------------------
Returns a filtered list of unitIDs, only including those that are buildable by baseBuilderUnitID or a unit that baseBuilderUnitID builds (recursive)

Params:
	baseBuilderUnitID - (Text, optional) The base unit to determine buildability. Will default to "base_commander"

Returns:
    null - baseBuilderUnitID is not a valid unit IDs
	array - all unit IDs that are buildable
*/
bif.getBuildableUnitIDs = function(baseBuilderUnitID) {
	if (bif.checkBIFReady("getBuildableUnitIDs") == false) {
		return null;
	}
	
	baseBuilderUnitID = baseBuilderUnitID == null ? "base_commander" : baseBuilderUnitID;
	
	if (bif.checkBIFBlueprintExists("getBuildableUnitIDs", "units", baseBuilderUnitID) == false) {
		return null;
	}
	
	if (bif._buildable_units[baseBuilderUnitID] != null) {
		return bif._buildable_units[baseBuilderUnitID];
	} else {
		var processedUnitIDs = [];
		var buildableUnitIDs = [];
		var toProcessUnitIDs = [baseBuilderUnitID];
		
		var playerBuildableUnitIDs = [];
		
		var nextUnitID = null;
		
		do {
			nextUnitID = toProcessUnitIDs.pop();
						
			if ($.inArray(nextUnitID, processedUnitIDs) < 0 && bif.units[nextUnitID].buildable_types != null) {
				var buildableTypes = bif.getUnitBuildableTypeUnitIDs(nextUnitID);
				buildableUnitIDs = buildableUnitIDs.concat(buildableTypes);
				toProcessUnitIDs = toProcessUnitIDs.concat(buildableTypes);
		
				processedUnitIDs.push(nextUnitID);
			}
		} while (toProcessUnitIDs.length > 0);
		
		$.each(buildableUnitIDs, function(i, el){
			if($.inArray(el, playerBuildableUnitIDs) === -1) {
				playerBuildableUnitIDs.push(el);
			}
		});
		
		bif._buildable_units[baseBuilderUnitID] = playerBuildableUnitIDs;
		return playerBuildableUnitIDs;
	}
}





////****************////
//// Tool Functions ////
////****************////

/*
toolBlueprintExists
-------------------
Check if a tool exists with a specified tool ID.

Params:
	toolID - (Text) The ID of a tool blueprint

Returns:
	boolean - whether a tool with the given toolID exists
*/
bif.toolBlueprintExists = function(toolID) {
	if (bif.checkBIFReady("toolBlueprintExists") == false) {
		return null;
	}
	
	return bif.units[toolID] != null;
}

/*
getToolBlueprintsFromArray
--------------------------
Returns an associative array of tool blueprints, built from an array of tool IDs

Params:
	toolIDArray - (Array - Text) The tool IDs to create an associative array from

Returns:
    null - toolIDArray is not an array
	associative array - the constructed associative array, consisting of all valid tools from toolIDArray.
*/
bif.getToolBlueprintsFromArray = function(toolIDArray) {
	if (bif.checkBIFReady("getToolBlueprintsFromArray") == false) {
		return null;
	}
	
	if ($.isArray(toolIDArray) == false) {
		return null;
	}

	var toolBlueprints = {};
	
	for (var i = 0; i < toolIDArray.length; i++) {
		if (bif.toolBlueprintExists(toolIDArray[i]) == true) {
			toolBlueprints[toolIDArray[i]] = bif.tools[toolIDArray[i]];
		}
	}
	
	return toolBlueprints;
}

/*
getToolBlueprint
----------------
Get the blueprint of the tool with the specified toolID

Params:
	toolID - (Text) The ID of a tool blueprint

Returns:
    null - a tool with the given tool ID does not exist
	associative array - the blueprint of the tool
*/
bif.getToolBlueprint = function(toolID) {
	if (bif.checkBIFReady("getToolBlueprint") == false) {
		return null;
	}

	if (bif.checkBIFBlueprintExists("getToolBlueprint", "tools", toolID) == false) {
		return null;
	}
	
	return bif.tools[toolID];
}

/*
getToolBlueprintInline
----------------------
Get the blueprint of the tool with the specified toolID, with ammo blueprint data incorporated

Params:
	toolID - (Text) The ID of a tool blueprint

Returns:
    null - a tool with the given tool ID does not exist
	associative array - the blueprint of the tool
*/
bif.getToolBlueprintInline = function(toolID) {
	if (bif.checkBIFReady("getToolBlueprintInline") == false) {
		return null;
	}

	if (bif.checkBIFBlueprintExists("getToolBlueprintInline", "tools", toolID) == false) {
		return null;
	}
	
	var inlinedBlueprint = $.extend(true, {}, bif.tools[toolID]);
	
	if (inlinedBlueprint.ammo_id != null) {
		if(_.isArray(inlinedBlueprint.ammo_id)) {
			inlinedBlueprint.ammo_blueprint = bif.getAmmoBlueprint(bif.getBlueprintIDFromPath(inlinedBlueprint.ammo_id[0].id));
		} else {
			inlinedBlueprint.ammo_blueprint = bif.getAmmoBlueprint(bif.getBlueprintIDFromPath(inlinedBlueprint.ammo_id));
		}
	}
	
	return inlinedBlueprint;
}

/*
getToolBlueprints
-----------------
Get the blueprints of all tools

Params:
	none

Returns:
	associative array - the blueprints of all tools
*/
bif.getToolBlueprints = function() {
	if (bif.checkBIFReady("getToolBlueprints") == false) {
		return null;
	}
	
	return bif.tools;
}

/*
getToolIDs
----------
Get the unit IDs of all tools

Params:
	none

Returns:
	array - the unit IDs of all tools
*/
bif.getToolIDs = function() {
	if (bif.checkBIFReady("getToolIDs") == false) {
		return null;
	}
	
	return bif.tools_id;
}

/*
getWeaponBlueprints
-------------------
Get the blueprints of all weapons

Params:
	none

Returns:
	associative array - the blueprints of all weapons
*/
bif.getWeaponBlueprints = function() {
	if (bif.checkBIFReady("getWeaponBlueprints") == false) {
		return null;
	}
	
	var weaponBlueprintsArray = bif.getBlueprintsArray(bif.tools);
	
	weaponBlueprintsArray = weaponBlueprintsArray.filter(function (el) {
		return weaponBlueprintsArray[el].tool_type == "TOOL_Weapon";
	});
	
	return bif.getBlueprintsFromBlueprintsArray(weaponBlueprintsArray);
}

/*
getWeaponIDs
------------
Get the IDs of all weapons

Params:
	none

Returns:
	array - the IDs of all weapons
*/
bif.getWeaponIDs = function() {
	if (bif.checkBIFReady("getWeaponIDs") == false) {
		return null;
	}
	
	return bif.tools_id.filter(function (el) {
		return bif.tools[el].tool_type == "TOOL_Weapon";
	});
}

/*
getBuildArmBlueprints
-------------------
Get the blueprints of all build arms

Params:
	none

Returns:
	associative array - the blueprints of all build arms
*/
bif.getBuildArmBlueprints = function() {
	if (bif.checkBIFReady("getBuildArmBlueprints") == false) {
		return null;
	}
	
	var buildArmBlueprintsArray = bif.getBlueprintsArray(bif.tools);
	
	buildArmBlueprintsArray = buildArmBlueprintsArray.filter(function (el) {
		return buildArmBlueprintsArray[el].tool_type == "TOOL_Weapon";
	});
	
	return bif.getBlueprintsFromBlueprintsArray(buildArmBlueprintsArray);
}

/*
getBuildArmIDs
--------------
Get the IDs of all build arms

Params:
	none

Returns:
	array - the IDs of all build arms
*/
bif.getBuildArmIDs = function() {
	if (bif.checkBIFReady("getBuildArmIDs") == false) {
		return null;
	}
	
	return bif.tools_id.filter(function (el) {
		return bif.tools[el].tool_type == "TOOL_BuildArm";
	});
}

/*
getWeaponBlueprintAmmoID
------------------------
Get the ammo ID used by the given weapon ID.

Params:
	weaponID - (Text) The ID of the weapon

Returns:
	Text - the ID of the ammo used by the given weapon
*/
bif.getWeaponBlueprintAmmoID = function(weaponID) {
	if (bif.checkBIFReady("getWeaponBlueprintAmmoID") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getWeaponBlueprintAmmoID", "tools", weaponID) == false) {
		return null;
	}
	
	return bif.getBlueprintIDFromPath(bif.tools[weaponID].ammo_id);
}


/*
getWeaponBlueprintAmmo
----------------------
Get the ammo blueprint used by the given weapon ID.

Params:
	weaponID - (Text) The ID of the weapon

Returns:
	associative Array - the Blueprint of the ammo used by the given weapon
*/
bif.getWeaponBlueprintAmmo = function(weaponID) {
	if (bif.checkBIFReady("getWeaponBlueprintAmmo") == false) {
		return null;
	}
	
	if (bif.checkBIFBlueprintExists("getWeaponBlueprintAmmo", "tools", weaponID) == false) {
		return null;
	}
	
	return bif.getAmmoBlueprint(bif.tools[weaponID].ammo_id);
}





////****************////
//// Ammo Functions ////
////****************////

/*
ammoBlueprintExists
-------------------
Check if a ammo exists with a specified ammo ID.

Params:
	ammoID - (Text) The ID of a ammo blueprint

Returns:
	boolean - whether a ammo with the given toolID exists
*/
bif.ammoBlueprintExists = function(ammoID) {
	if (bif.checkBIFReady("ammoBlueprintExists") == false) {
		return null;
	}
	
	return bif.ammo[ammoID] != null;
}

/*
getAmmoBlueprintsFromArray
--------------------------
Returns an associative array of ammo blueprints, built from an array of ammo IDs

Params:
	ammoIDArray - (Array - Text) The ammo IDs to create an associative array from

Returns:
    null - ammoIDArray is not an array
	associative array - the constructed associative array, consisting of all valid ammo blueprints from ammoIDArray.
*/
bif.getAmmoBlueprintsFromArray = function(ammoIDArray) {
	if (bif.checkBIFReady("getAmmoBlueprintsFromArray") == false) {
		return null;
	}
	
	if ($.isArray(ammoIDArray) == false) {
		return null;
	}

	var ammoBlueprints = {};
	
	for (var i = 0; i < ammoIDArray.length; i++) {
		if (bif.ammoBlueprintExists(ammoIDArray[i]) == true) {
			ammoBlueprints[ammoIDArray[i]] = bif.ammo[ammoIDArray[i]];
		}
	}
	
	return ammoBlueprints;
}

/*
getAmmoBlueprint
----------------
Get the blueprint of the ammo with the specified ammoID

Params:
	ammoID - (Text) The ID of a ammo blueprint

Returns:
    null - an ammo blueprint with the given ammo ID does not exist
	associative array - the blueprint of the ammo
*/
bif.getAmmoBlueprint = function(ammoID) {
	if (bif.checkBIFReady("getAmmoBlueprint") == false) {
		return null;
	}

	if (bif.checkBIFBlueprintExists("getAmmoBlueprint", "ammo", ammoID) == false) {
		return null;
	}
	
	return bif.ammo[ammoID];
}

/*
getAmmoBlueprints
-----------------
Get all ammo blueprints

Params:
	none

Returns:
	associative array - all ammo blueprints
*/
bif.getAmmoBlueprints = function() {
	if (bif.checkBIFReady("getAmmoBlueprints") == false) {
		return null;
	}
	
	return bif.ammo;
}

/*
getAmmoIDs
----------
Get the ammo IDs of all ammo blueprints

Params:
	none

Returns:
	array - the ammo IDs of all ammo blueprints
*/
bif.getAmmoIDs = function() {
	if (bif.checkBIFReady("getAmmoIDs") == false) {
		return null;
	}
	
	return bif.ammo_id;
}
