import registerGlobal from "./registerGlobal/index.js";
import bindTableEvents from "./bindTableEvents.js";

export { bindTableEvents };
export default bindTableEvents;

registerGlobal(bindTableEvents);