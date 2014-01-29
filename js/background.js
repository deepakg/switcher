var sites = {};
var groups = [];
loadSettings();
function loadSettings() {
    sites = JSON.parse(localStorage.sites) || {};
    groups = JSON.parse(localStorage.groups) || [];
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log(request);
      // console.log(sites);
      // console.log(groups);
      // console.log(sites[request.site]);
      // console.log(groups[sites[request.site]]);
      if(sites[request.site] != undefined) {
          //console.log("gevonden");
          sendResponse(groups[sites[request.site]]);
      }

      if(sites[request.site] != undefined && request.popup) {
          sendResponse(groups[sites[request.site]]);
      }
});

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(updateListener);
chrome.tabs.onCreated.addListener(createListener);
chrome.tabs.onReplaced.addListener(replaceListener);
    
function replaceListener(added, removed) {
    chrome.tabs.get(added, createListener);
}
                                   
function createListener(tab) {
    showSwitcher(tab);
}

function updateListener(tabId, changeInfo, tab) {
    if(tabId && changeInfo && changeInfo.status && changeInfo.status == "loading") {
        showSwitcher(tab);
    }
}

function showSwitcher(tab) {
    if(tab && tab.id && tab.url) {
        var uri = URI(tab.url);
        if(uri) {
            var origin = uri.protocol() + "://" + uri.hostname();
            // console.log(origin);
            // console.log(tabId);
            // console.log(sites[origin]);
            if(sites[origin] != undefined) {
                //console.log("showing");
                chrome.pageAction.show(tab.id);
            }
            else {
                //console.log("hiding");
                chrome.pageAction.hide(tab.id);
            }
        }
    }

}

// chrome.extension.onRequest.addListener(function(request, sender, callback) {
//     if(request == 'getGroup') {
//         var group = {};
//         if(sites[request.origin] != undefined) {
//             group = groups[sites[request.origin]];
//             callback(group);
//             return;
//         }
//     }

// });

// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if(request.action == "getGroup") {
//       var group = {};
//       if (sites[request.origin] != undefined) {
//         group = groups[sites[request.origin]];
//       }
//       sendResponse({group: group, keypressed: request.keypressed});
//     }
//   }
// );
