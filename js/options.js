function OptionCtrl($scope) {
    // 1. Initialize with an empty array or loading state
    $scope.groups = [];

    // 2. Load data asynchronously from chrome.storage
    chrome.storage.local.get(['raw'], function(result) {
        $scope.$apply(function() {
            if (result.raw) {
                var settings = JSON.parse(result.raw);
                if (Array.isArray(settings) && settings.length > 0) {
                    $scope.groups = settings;
                }
            }
            
            // If still empty, add default group
            if ($scope.groups.length === 0) {
                $scope.add_group();
            }
        });
    });

    $scope.dump = function() {
        console.log(JSON.stringify($scope.groups));
        $scope.transform();
    };

    $scope.add_group = function() {
        var element = {
            'params': false,
            'websites': [
                { 'shortcut': '', 'url': '' },
                { 'shortcut': '', 'url': '' },
                { 'shortcut': '', 'url': '' }
            ]
        };
        $scope.groups.push(element);
    };

    $scope.remove_group = function(index) {
        $scope.groups.splice(index, 1);
    };

    $scope.add_item = function(index) {
        $scope.groups[index].websites.push({ 'shortcut': '', 'url': '' });
    };

    $scope.remove_item = function(group_index, item_index) {
        $scope.groups[group_index].websites.splice(item_index, 1);
    };

    $scope.transform = function() {
        var sites = {};
        var groups = [];
        for (var i = 0; i < $scope.groups.length; i++) {
            var added_group = false;
            for (var j = 0; j < $scope.groups[i].websites.length; j++) {
                var item = $scope.groups[i].websites[j];
                if (item.shortcut.trim() !== "" && item.url.trim() !== "") {
                    try {
                        // Use native URL instead of URI library for MV3 compatibility
                        var urlObj = new URL(item.url.trim());
                        var uri_str = urlObj.protocol + "//" + urlObj.hostname;
                        
                        item.url = uri_str;
                        sites[uri_str] = i;

                        if (!added_group) {
                            groups.push({ carry_params: $scope.groups[i].params });
                            added_group = true;
                        }

                        if (added_group) {
                            groups[groups.length - 1][item.shortcut] = uri_str;
                        }
                    } catch (e) {
                        console.error("Invalid URL:", item.url);
                    }
                }
            }
        }
        return { sites: sites, groups: groups };
    };

    $scope.save = function() {
        var settings = $scope.transform();

        // 3. Save to chrome.storage.local (Replaces localStorage)
        chrome.storage.local.set({
            raw: JSON.stringify($scope.groups),
            sites: settings.sites, // We store as object/array directly, no need for JSON.stringify
            groups: settings.groups
        }, function() {
            // Note: No need to call loadSettings() on background page.
            // The service worker will fetch fresh data from storage on the next event.
            alert("Settings saved!");
            window.close();
        });
    };

    $scope.close = function () {
	window.close()
    }
}
