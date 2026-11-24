import meta from "./meta.js";

export const registerGlobal = (domTableEvents) => {
    if (typeof globalThis === "undefined" || !domTableEvents) return;

    globalThis.ks ??= {};

    globalThis.ks.domTableEvents = {
        meta,
        bindTableEvents: domTableEvents.bindTableEvents,
        actions: domTableEvents.actions,
        state: domTableEvents.state
    };
};

export default registerGlobal;
