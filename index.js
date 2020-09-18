var listeners = {
    events: {
        "events/ui/view/on-page-open": [],
        "events/ui/view/on-block-context-menu-clicked": [],
    }
}

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

var isIframe = (typeof window !== 'undefined')
var post = (isIframe ? postMessage : null);
var port = null;
var responseQueue = {};

var logseq = {



    events: {
        addEventListener: (ev, fn) => {
            if (Object.keys(listeners.events).includes(ev)) listeners.events[ev].push(fn);
        }
    },

    actions: {
        ui: {
            showNotification: (c, s) => {
                post(["actions", { actionName: "actions/ui/notification/show", arguments: { content: c, status: s } }])
            },
            overwriteBlockContent: (id, content) => {
                post(["actions", { actionName: "actions/ui/block/overwrite-block-content", arguments: { content: content, id: id } }])
            }
        },
        get: { // Get data from main thread
            currentPage: async() => {
                let actionId = "c" + randomString(8);
                return new Promise((resolve, reject) => {
                    responseQueue[actionId] = { resolve: resolve, reject: reject };
                    post(["actions", { actionName: "actions/get/current-page", "event-id": actionId }]);
                    setTimeout(reject, 5000);
                })
            },
            currentBlock: async() => {
                let actionId = "c" + randomString(8);
                return new Promise((resolve, reject) => {
                    responseQueue[actionId] = { resolve: resolve, reject: reject };
                    post(["actions", { actionName: "actions/get/current-block", "event-id": actionId }]);
                    setTimeout(reject, 5000);
                })
            }
        }
    }
}

onmessage = (msg) => {
    const channel = msg.data[0]
    const message = msg.data[1]

    if (channel === "events" && Object.keys(listeners.events).includes(message.eventName)) {
        listeners.events[message.eventName].forEach(fn => {
            fn(message.context)
        })
    } else if (channel === "response" && Object.keys(responseQueue).includes(message["event-id"])) {
        // Resolve promise to object
        responseQueue[message["event-id"]].resolve(message.response);
    }
}

if (isIframe) {
    window.addEventListener('message', (msg) => {
        if (msg.ports && msg.ports[0]) {
            port = msg.ports[0]
            post = (m) => { port.postMessage(m) };
            port.onmessage = onmessage;
        }
    });
}
