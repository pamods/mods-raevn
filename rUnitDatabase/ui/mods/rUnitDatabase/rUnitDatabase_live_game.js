//==============================
// rUnitDatabase - Unit Database
//------------------------------
// rUnitDatabase_live_game.js
// Created by Raevn
// Version 1.2.0 (2014/03/03)
//------------------------------


loadScript("coui://ui/mods/rUnitDatabase/rUnitDatabase_base.js");

//$.get("coui://ui/mods/rUnitDatabase/rUnitDatabase.html", function (data) {$("body").append(data); ko.applyBindings(model, document.getElementById("unitDatabase"));});


bif.registerBIFReadyCallback(function () {
  api.Panel.message("options_bar","udbloaded", true);
  console.log("BIF callback livegame");
});

handlers.udbopen = function(payload){
  console.log("OPEN UDB");
  model.ud.showUnitDatabase(!model.ud.showUnitDatabase());
}

console.log("UNITDB INIT");

createFloatingFrame('unitdb_frame', 220, 220, { 'offset': 'leftCenter', 'top': -50 });
$('#unitdb_frame_content').append(
    $.ajax({
        type: "GET",
        url: 'coui://ui/mods/rUnitDatabase/rUnitDatabase.html',
        async: false
    }).responseText
);
//ko.applyBindings(model, document.getElementById("unitDatabase"));