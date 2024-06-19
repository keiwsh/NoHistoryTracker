var running = false;

// Initialize the extension on browser startup
browser.runtime.onStartup.addListener(() => {
    initializeExtension();
});

// Also initialize the extension when it is installed or updated
browser.runtime.onInstalled.addListener(() => {
    initializeExtension();
});

function initializeExtension() {
    // Log to check if the initialization function is called
    console.log('Initializing extension...');
    
    // Retrieve the running state from storage
    browser.storage.local.get('running').then((result) => {
        if (result.running !== undefined) {
            running = result.running;
            console.log('Extension state loaded from storage:', running);
        } else {
            console.log('No previous state found in storage');
        }

        // Add listener for history visits
        browser.history.onVisited.addListener(function onVisited(item) {
            console.log('New page visited:', item.url);

            if (running) {
                browser.history.getVisits({ url: item.url }).then(function (visits) {
                    console.log('Number of visits for', item.url, ':', visits.length);

                    if (visits.length === 1) {
                        browser.history.deleteUrl({ url: item.url }).then(() => {
                            console.log('Deleted URL from history:', item.url);
                        }).catch((error) => {
                            console.error('Error deleting URL from history:', error);
                        });
                    }
                }).catch((error) => {
                    console.error('Error getting visits for URL:', error);
                });
            }
        });
    }).catch((error) => {
        console.error('Error loading extension state from storage:', error);
    });
}

// Handle the browser action button click to toggle the running state
browser.browserAction.onClicked.addListener(function () {
    running = !running;
    console.log('Extension state changed:', running);

    // Update the running state in storage
    browser.storage.local.set({ running: running }).then(() => {
        console.log('Extension state saved to storage:', running);
    }).catch((error) => {
        console.error('Error saving extension state to storage:', error);
    });
});
