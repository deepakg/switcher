var origin = window.location.origin;

window.addEventListener("keypress", function(event) {
  if(event.target.type != 'search' && event.target.type != 'select-one'
     && event.target.type != 'text' && event.target.type != 'textarea' && event.target.type != 'password') {
      
      var key = String.fromCharCode(event.charCode);
      chrome.runtime.sendMessage({site:origin}, function(response) {
          console.log(key);
          console.log(response[key]);
          if(response[key]) {
              if(response.carry_params) {
                  window.location = response[key] + window.location.pathname + window.location.search;
              }
              else {
		          window.location = response[key];
              }
          }
      });
  }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        if(request.method == 'getOrigin') {
            return origin;
        }
    }
);

    // chrome.extension.sendRequest(
    //     'getGroup',
    //     function(group) {
	//         if(group[key]) {
	//             if(group.carry_params) {
	// 	            window.location = group[key] + window.location.pathname + window.location.search;
	//             }
    //             else {
	// 	            window.location = response.group[key];
	//             }
	//         }
    //     }
    // );     
