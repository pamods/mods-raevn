# Blueprint Info Framework

## 1.4.6

- Fix missing observable parens in ammo loading that blocked ready events
- Fix operator precedence issue in unittype filtering
- Significant optimization of unittype filtering
- Cache buildable types, mainly for CmdBuild

## 1.4.5

- Patches for Titans

## 1.4.4

- Support localisation for units and ammo

## 1.4.3

- Removed check for EULA

## 1.4.2

- Fix for array ammo

## 1.4.1

- Fix imagepaths for new build 63180

## 1.4.0

- Some additional error checking & logging added
- Minor bugfixes
- Start screen UI removed - there is the knockout observable model.BIFReady() that can be used for loading code if required.
- Added a loading gif in the img\ folder that has a transparent background.

## 1.3.0

- Feature: Progress information on loading screen
- Feature: Supports additional scenes introduced in 61450
- Feature: `bif.loaded_units`, `bif.loaded_tools`, `bif.loaded_ammo` and `bif.loaded_images` made into observable vars
- Bugfix: BIF now only marks itself as loaded once all images have been checked
- Bugfix: Queue implemented for image checking; should solve errors on Mac

The max queue size has been set to 50, if this still causes issues, try changing `bif.MAX_FILECHECK_QUEUE` (at the top of the js file) to a lower value, and let me know what value worked for you.

## 1.2.0

- Bugfix: Added timeout to jsonXMLHttpRequests
- Feature: Added support for alternate strategic icons via si_name attribute
- Feature: Added "inherited" attribute to blueprints
- Bugfix: Not all units getting additional attributes
- Feature: Added function "sortBlueprintAlphabetically(blueprint)"
- Bugfix: sortBlueprintsByAttribute was not checking if BIF was loaded
- Bugfix: getUnitBlueprintInline / getToolBlueprintInline were not returning a copy of the original data

## 1.1.0

- Added attributes "strategicIcon" and "buildPicture" to all units
- Added function "getUnitBlueprintInline(unitID)"
- Added function "getToolBlueprintInline(toolID)"
