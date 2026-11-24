import meta from "./meta.js";

const registerGlobal = (bindTableEvents) => {
    if (typeof globalThis === "undefined" || !bindTableEvents) return;

    globalThis.ks ??= {};
    globalThis.ks.domEvents ??= {};
    globalThis.ks.domEvents.table ??= {};

    globalThis.ks.domEvents.table = {
        meta,
        bindTableEvents
    };
};

export default registerGlobal;
