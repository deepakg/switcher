// Helper to get data from storage since localStorage is gone
async function getSettings() {
    const data = await chrome.storage.local.get(['sites', 'groups']);
    return {
        sites: data.sites || {},
        groups: data.groups || []
    };
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    getSettings().then(({ sites, groups }) => {
        if (sites[request.site] !== undefined) {
            sendResponse(groups[sites[request.site]]);
        }
    });
    return true; // Keep channel open for async response
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading") {
        showSwitcher(tab);
    }
});

chrome.tabs.onCreated.addListener(showSwitcher);

// Replaced tabs (rare, but handled)
chrome.tabs.onReplaced.addListener((addedTabId) => {
    chrome.tabs.get(addedTabId, showSwitcher);
});

async function showSwitcher(tab) {
    if (!tab?.url || !tab.id) return;

    try {
        const { sites } = await getSettings();
        // Using native URL object instead of external URI library
        const url = new URL(tab.url);
        const origin = `${url.protocol}//${url.hostname}`;

        if (sites[origin] !== undefined) {
            // MV3 uses chrome.action instead of pageAction
            chrome.action.enable(tab.id);
        } else {
            chrome.action.disable(tab.id);
        }
    } catch (e) {
        // Ignore internal chrome:// pages or invalid URLs
    }
}
