const { measureStart, measureEnd } = require("./common");
const { init, info } = require("./ws");

try {(async () => {

console.log("Loading OBS Module"); const mGlobal = measureStart();
await init();
await require("./app").init();
info(`OBS Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }