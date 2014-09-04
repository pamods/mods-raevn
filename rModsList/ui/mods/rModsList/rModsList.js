(function() {
    model.rModList = {};
    model.rModList.modItems = ko.observableArray([]);
    model.rModList.updatesRequired = ko.observable(0);

    $.getJSON(
        "https://pamm-mereth.rhcloud.com/api/mod",
        function(availableMods) {
            var modsmap = {};
            for(var i = 0; i <availableMods.length; ++i) {
                var mod = availableMods[i];
                modsmap[mod.identifier] = mod;
            }
            
            api.mods.getMountedMods("client", function (mods) {
                var updatesRequired = 0;
                for(var i = 0; i < mods.length; ++i) {
                    var mod = mods[i];
                    
                    var avmod = modsmap[mod.identifier];
                    if(!avmod) avmod = {};
                    
                    mod.icon = avmod.icon ? avmod.icon : "coui://ui/mods/rModsList/img/generic.png";
                    mod.update_required = avmod.version && mod.version !== avmod.version;
                    
                    model.rModList.modItems.push(mod);
                    
                    if(mod.update_required) {
                        updatesRequired++;
                    }
                }
                
                model.rModList.modItems.sort(function(a, b) { return a.display_name === b.display_name ? 0 : (a.display_name < b.display_name ? -1 : 1) })
                model.rModList.updatesRequired(updatesRequired);
            });
        },
        'json'
    );
    
    $('#sidebar-tabs').append('<li><a href="#mods" data-toggle="pill" data-bind="click_sound: \'default\', rollover_sound: \'default\'">Mods <img src="coui://ui/mods/rModsList/img/alert.png" height="14" data-bind="visible: model.rModList.updatesRequired() > 0"></a></li>');
    
    $.get("coui://ui/mods/rModsList/rModsList.html", function (data) {
        $('.tab-content').append(data); 
        ko.applyBindings(model, document.getElementById("mods"));
        
        if (model.rModList.updatesRequired() > 0) {
            $('#mods').find('.ytv-list-inner').css('top', '66px');
        }
    });
})();