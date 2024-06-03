const { measureStart, measureEnd } = require("./common");
const { init, info } = require("./ws");

try {(async () => {

console.log("Loading Web Module"); const mGlobal = measureStart();
await init();
await require("./app").init();
info(`Web Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }