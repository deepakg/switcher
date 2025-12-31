let tabId = 0;

window.onload = function() {
    // In MV3, we avoid getBackgroundPage() as it's often null.
    // We rely on chrome.runtime.sendMessage to talk to the Service Worker.
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs && tabs.length > 0) {
            const activeTab = tabs[0];
            tabId = activeTab.id;

            try {
                const urlObj = new URL(activeTab.url);
                const origin = `${urlObj.protocol}//${urlObj.hostname}`;
                const searchParams = urlObj.search; // Equivalent to uri.search()

                chrome.runtime.sendMessage({site: origin, popup: 1}, function(response) {
                    // Check if response exists (site might not be in a group)
                    if (!response) {
                        document.getElementById("links").innerHTML = "<p>No switcher group found for this site.</p>";
                        return;
                    }

                    const keys = Object.keys(response).sort();
                    let html = "<ul>";

                    keys.forEach(function(key) {
                        if (key !== 'carry_params') {
                            const targetUrl = response[key];
                            
                            if (targetUrl === origin) {
                                // Current site: show as text, not a link
                                html += `<li><span>${targetUrl}</span></li>`;
                            } else {
                                // Other site in group: create link
                                let href = targetUrl;
                                if (response['carry_params']) {
                                    href += searchParams;
                                }
                                html += `<li><a href="${href}">${targetUrl}</a></li>`;
                            }
                        }
                    });

                    html += "</ul>";
                    document.getElementById("links").innerHTML = html;
                });
            } catch (e) {
                console.error("Invalid URL or internal page:", activeTab.url);
            }
        }
    });
};

// Handle link clicks
window.onclick = function(event) {
    if (event.target.nodeName === 'A') {
        event.preventDefault(); // Prevent default browser navigation
        const newUrl = event.target.href;
        if (newUrl && tabId) {
            chrome.tabs.update(tabId, { url: newUrl });
            window.close(); // Close the popup after switching
        }
    }
};
