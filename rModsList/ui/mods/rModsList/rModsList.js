model.rModList = {};

model.rModList.loadModJSON = function(src) {
    console.log(src, "loading json");
    var o = new XMLHttpRequest();
	
    try
    {
        o.open('GET', src, false);
        o.send('');
    }
    catch( err )
    {
        console.log("error loading " + src)
        return;
    }
    var jsonData = decode(o.responseText);
	return jsonData;
}

model.rModList["modData"] = model.rModList.loadModJSON("coui://ui/mods/mods_list.json");
model.rModList["onlineModData"] = model.rModList.loadModJSON("http://pamods.github.io/modlist.json");
model.rModList["updatesRequired"] = ko.observable(0);

var arrayData = [];
	
for (var id in model.rModList.modData) {
	if (model.rModList.modData[id].enabled === true && id != "rPAMM") {
		arrayData.push(model.rModList.modData[id]);
		arrayData[arrayData.length - 1].author = arrayData[arrayData.length - 1].author ? arrayData[arrayData.length - 1].author : "";
		arrayData[arrayData.length - 1].build = arrayData[arrayData.length - 1].build ? arrayData[arrayData.length - 1].build : "";
		arrayData[arrayData.length - 1].display_name = arrayData[arrayData.length - 1].display_name ? arrayData[arrayData.length - 1].display_name : "";
		arrayData[arrayData.length - 1].version = arrayData[arrayData.length - 1].version ? arrayData[arrayData.length - 1].version : "";
		arrayData[arrayData.length - 1].icon = arrayData[arrayData.length - 1].icon ? arrayData[arrayData.length - 1].icon : "coui://ui/mods/rModsList/img/generic.png";
		arrayData[arrayData.length - 1].forum = arrayData[arrayData.length - 1].forum ? arrayData[arrayData.length - 1].forum : "";
		arrayData[arrayData.length - 1].date = arrayData[arrayData.length - 1].date ? arrayData[arrayData.length - 1].date : "";
		arrayData[arrayData.length - 1].update_required = false;
		
		if (model.rModList.onlineModData[id] != null) {
			if (arrayData[arrayData.length - 1].date < model.rModList.onlineModData[id].date) {
				model.rModList.updatesRequired(model.rModList.updatesRequired() + 1);
				arrayData[arrayData.length - 1].update_required = true;
			}
		}
	}
}

model.rModList["modItems"] = ko.observableArray(arrayData);

$('#sidebar-tabs').append('<li><a href="#mods" data-toggle="pill" data-bind="click_sound: \'default\', rollover_sound: \'default\'">Mods <!-- ko if: model.rModList.updatesRequired() > 0 --><img src="coui://ui/mods/rModsList/img/alert.png" height="14"><!-- /ko --></a></li>');

$.get("coui://ui/mods/rModsList/rModsList.html", function (data) {
	$('.tab-content').append(data); 
	ko.applyBindings(model, document.getElementById("mods"));
	
	if (model.rModList.updatesRequired() > 0) {
		$('#mods').find('.ytv-list-inner').css('top', '66px');
	}
});
