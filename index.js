var listeners = {
    events: {
        "events/ui/view/on-page-open": [],
        "events/ui/view/on-block-context-menu-clicked": [],
    }
}

var post = postMessage;

var logseq = {

    events: {
        addEventListener: (ev, fn) => {
            if (Object.keys(listeners.events).includes(ev)) listeners.events[ev].push(fn);
        }
    },

    actions: {
        ui: {
            showNotification: (c, s) => {
                post(["actions", {actionName: "actions/ui/notification/show", arguments: {content: c, status: s}}])
            },
            overwriteBlockContent: (id, content) => {
                post(["actions", {actionName: "actions/ui/block/overwrite-block-content", arguments: {content: content, id: id}}])
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
    }
}