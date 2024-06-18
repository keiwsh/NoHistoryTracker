var running = false;

browser.runtime.onStartup.addListener(() => {
    initializeExtension();
});

browser.runtime.onInstalled.addListener(() => {
    initializeExtension();
});

function initializeExtension() {
    browser.storage.local.get('running').then((result) => {
        if (result.running !== undefined) {
            running = result.running;
        }

        browser.history.onVisited.addListener(function onVisited(item) {
            if (running) {
                browser.history.getVisits({ url: item.url }).then(function (visits) {
                    if (visits.length === 1) {
                        browser.history.deleteUrl({ url: item.url });
                    }
                });
            }
        });
    });
}

browser.browserAction.onClicked.addListener(function () {
    running = !running;
    browser.storage.local.set({ running: running });
});
