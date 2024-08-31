const { measureStart, measureEnd } = require("./common"); 
const { init, info } = require("./ws");

try {(async () => {

const mGlobal = measureStart();
await init();
require("./app").init();
info(`clonktracker Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }
