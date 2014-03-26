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
	var arrayData = [];
	
	for (var id in jsonData) {
		if (jsonData[id].enabled === true && id != "rPAMM") {
			arrayData.push(jsonData[id]);
			arrayData[arrayData.length - 1].author = arrayData[arrayData.length - 1].author ? arrayData[arrayData.length - 1].author : "";
			arrayData[arrayData.length - 1].build = arrayData[arrayData.length - 1].build ? arrayData[arrayData.length - 1].build : "";
			arrayData[arrayData.length - 1].display_name = arrayData[arrayData.length - 1].display_name ? arrayData[arrayData.length - 1].display_name : "";
			arrayData[arrayData.length - 1].version = arrayData[arrayData.length - 1].version ? arrayData[arrayData.length - 1].version : "";
			arrayData[arrayData.length - 1].icon = arrayData[arrayData.length - 1].icon ? arrayData[arrayData.length - 1].icon : "coui://ui/mods/rModsList/img/generic.png";
			arrayData[arrayData.length - 1].forum = arrayData[arrayData.length - 1].forum ? arrayData[arrayData.length - 1].forum : "";
		}
	}
    return arrayData;
}
model.rModList["showModsList"] = ko.observable(false);
model.rModList["modItems"] = ko.observableArray(model.rModList.loadModJSON("coui://ui/mods/mods_list.json"));

$('#sidebar-tabs').append('<li><a href="#mods" data-toggle="pill" data-bind="click_sound: \'default\', rollover_sound: \'default\'">Mods</a></li>');

$('.tab-content').append('<div class="tab-pane" id="mods">' +
	'<div class="ytv-wrapper id="mod-wrapper">' +
		'<div class="ytv-relative">' +
			'<div class="ytv-list" style="height: 934px">' + 
				'<div class="ytv-list-header">' + 
					'<a href="#">' +
						'<img src="coui://ui/mods/rModsList/img/PAMM.png">' + 
						'<span style="display: inline" data-bind="text: model.rModList.modItems().length + \' Mods Enabled\'"></span>' +
					'</a>' +
				'</div>' +
				'<div class="ytv-list-inner">' + 
					'<!-- ko foreach: model.rModList.modItems -->' +
						'<div class="rModsList-mod">' +
							'<img class="rModsList-mod-icon" src="" width="50px" height="50px" data-bind="attr: {src: $data.icon}" style="float:left; margin-right: 10px;">' +
							'<div class="rModsList-mod-name" data-bind="text: $data.display_name, click: function() {inGameBrowser.open($data.forum)}" style="font-weight: bold"></div>' +
							'<div class="rModsList-mod-author" data-bind="text: $data.author" style=""></div>' +
							'<div class="rModsList-mod-version" data-bind="text: \'v\' + $data.version"></div>' +
						'</div>' +
					'<!-- /ko -->' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>' +
'</div>');