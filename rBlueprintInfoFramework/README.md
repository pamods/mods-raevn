# Blueprint Info Framework

This loads all the unit, tool and ammo data (and caches it in the session, so it doesn't re-load it all per scene), and then provides a large number of utility functions for it (currently 49).

All blueprints include the non-overridden fields of any inherited blueprints, so you don't need to look up the chain. It does not expand weapons/build arms or ammo into the unit or weapon blueprints respectively, but does give many functions to access these separately.

This also adds some additional information to the blueprints (added during loading; they are not written to the blueprint files):

- **id** - the id of blueprint
- **path** - the file path of the blueprint
- **buildIndex** (for units) - an integer that determines the order that units appear in the build menu (lowest first)
- **inheritance** - an array of blueprints that form the inheritance chain for this blueprint
- **inherited** - an array of blueprints that inherit this blueprint
- **unit_types** - adds an additional unit type called `UNITTYPE__<unitID>` to all units. Note the extra underscore (to prevent clashes with existing types, such as with bomber). This allows you add or exclude individual units when filtering.
- **buildPicture** - The path to the unit's build picture, or null if it's not available.
- **strategicIcon** - The path to the unit's strategic icon, or the generic blip icon if a specific one is not available.
- **Documentation** for each of these functions can be found within the code; additionally, this will be collated into an online reference.

Current functions include:

## General Functions

- bif.getBIFReady()
- bif.registerBIFReadyCallback(functionCallback)
- bif.sortBlueprintsByAttribute(blueprints, attribute, type, ascending)
- bif.sortBlueprintAlphabetically(blueprint)
- bif.getBlueprintIDsFromBlueprints(blueprints)
- bif.getBlueprintIDFromPath(path)

## Unit Functions

- bif.unitBlueprintExists(unitID)
- bif.unitHasType(unitID, type)
- bif.getUnitBlueprintsFromArray(unitIDArray)
- bif.getUnitName(unitID)
- bif.sortBlueprintsByBuildOrder(blueprints)
- bif.getUnitBlueprint(unitID)
- bif.getUnitBlueprintInline(unitID)
- bif.getUnitBlueprints()
- bif.getUnitIDs()
- bif.getUnitBlueprintToolIDs(unitID)
- bif.getUnitBlueprintTools(unitID)
- bif.getUnitBlueprintWeaponIDs(unitID)
- bif.getUnitBlueprintWeapons(unitID)
- bif.getUnitBlueprintBuildArmIDs(unitID)
- bif.getUnitBlueprintBuildArms(unitID)
- bif.getFilteredUnitIDs(filter)
- bif.getFilteredUnitIDsFromArray(unitIDArray, filter)
- bif.getFilteredUnitBlueprints(filter)
- bif.getFilteredUnitBlueprintsFromArray (unitIDArray, filter)
- bif.getUnitBuildableTypeUnitIDs(unitID)
- bif.getUnitBuildableTypeBlueprints(unitID)
- bif.getUnitBuiltByUnitIDs(unitID)
- bif.getUnitBuiltByBlueprints(unitID)
- bif.getUnitIDIsBuiltBy(unitID, builderUnitID)
- bif.getUnitIDIsBuildable(unitID, baseBuilderUnitID)
- bif.getBuildableUnitIDsFromArray(unitIDArray, baseBuilderUnitID)
- bif.getBuildableUnitIDs(startUnitID)

## Tool Functions

- bif.toolBlueprintExists(toolID)
- bif.getToolBlueprintsFromArray(toolIDArray)
- bif.getToolBlueprint(toolID)
- bif.getToolBlueprintInline(toolID)
- bif.getToolBlueprints()
- bif.getToolIDs()
- bif.getWeaponBlueprints()
- bif.getWeaponBlueprintIDs()
- bif.getBuildArmBlueprints()
- bif.getBuildArmBlueprintIDs()
- bif.getWeaponBlueprintAmmoID(weaponID)
- bif.getWeaponBlueprintAmmo(weaponID)

## Ammo Functions

- bif.ammoBlueprintExists(ammoID)
- bif.getAmmoBlueprintsFromArray(ammoIDArray)
- bif.getAmmoBlueprint(ammoID)
- bif.getAmmoBlueprints()
- bif.getAmmoBlueprintIDs()

## Knockout Observables

- bif.loaded_units()
- bif.loaded_tools()
- bif.loaded_ammo()
- bif.loaded_images()
