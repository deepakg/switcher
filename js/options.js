function OptionCtrl($scope) {
    
    $scope.groups = get_groups();
    $scope.dump = function() {
        console.log(JSON.stringify($scope.groups));
        $scope.transform();
    };

    $scope.add_group = function() {
        var element = {
            'params': false,
            'websites' : [
                {
                    'shortcut':'',
                    'url':'',
                },
                { 
            'shortcut':'',
                    'url':'',
                },
                {
                    'shortcut':'',
                    'url':'',
                }
            ]
        };

        $scope.groups.push(element);
    }

    $scope.remove_group = function(index) {
        $scope.groups.splice(index,1);
    }

    $scope.add_item = function(index) {
        $scope.groups[index].websites.push({'shortcut':'', 'url':''});
    }

    $scope.remove_item = function(group_index, item_index) {
        $scope.groups[group_index].websites.splice(item_index,1);
    }

    $scope.transform = function() {
        var sites = {};
        var groups = [];
        for(var i=0; i < $scope.groups.length; i++) {
            var added_group = false;
            for(var j=0; j < $scope.groups[i].websites.length; j++) {
                if($scope.groups[i].websites[j].shortcut.trim() != ""
                   && $scope.groups[i].websites[j].url.trim() != "") {
                    var uri = URI($scope.groups[i].websites[j].url.trim());
                    var uri_str = "";
                    if (uri) {
                        //clean up the URL - we just store the protocol + host
                        //no trailing slash, no querystring
                        uri_str = uri.protocol() + "://" + uri.hostname();
                        $scope.groups[i].websites[j].url = uri_str;
                        sites[$scope.groups[i].websites[j].url] = i;
                        if (!added_group) {
                            groups.push({});
                            groups[groups.length - 1].carry_params = $scope.groups[i].params;
                            added_group = true;
                        }
                        
                        if(added_group) {
                            groups[groups.length - 1][$scope.groups[i].websites[j].shortcut]
                                = $scope.groups[i].websites[j].url;
                        }
                    }
                }
            }
        }

        return { sites: sites, groups: groups };

    }

    $scope.save = function() {
        var settings = $scope.transform();
        localStorage.raw = JSON.stringify($scope.groups);
        localStorage.sites = JSON.stringify(settings.sites);
        localStorage.groups = JSON.stringify(settings.groups);
        
        //load new settings
        chrome.extension.getBackgroundPage().loadSettings();
        alert("Settings saved!");
        window.close();
    }
}

function get_groups() {
    var groups = [];
    var element = {
        'params': false,
        'websites' : [
            {
                'shortcut':'',
                'url':'',
            },
            { 
                'shortcut':'',
                'url':'',
            },
            {
                'shortcut':'',
                'url':'',
            }
        ]
    };
    
    if(localStorage.raw) {
        var settings = JSON.parse(localStorage.raw);
        if (settings.constructor == Array && settings.length > 0) {
            groups = settings;
        }
    }
    
    if (groups.length == 0) {
        groups.push(element);
    }
    
    return groups;
}
