const { measureStart, measureEnd } = require("./common"); 
const { init, info } = require("./ws");

try {(async () => {

const mGlobal = measureStart();
await init();
info(`gcgizmo Module Loaded, total time: ${measureEnd(mGlobal)}ms`);
require("./app").init()

})();} catch (e) { console.log(e.stack); }