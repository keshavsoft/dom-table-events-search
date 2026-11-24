import registerGlobal from "./registerGlobal/index.js";
import bindTableEvents from "./bindTableEvents.js";

export { bindTableEvents };

const domTableEvents = {
    bindTableEvents
};

registerGlobal(domTableEvents);

export default domTableEvents;
