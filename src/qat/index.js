const { measureStart, measureEnd } = require("./common"); 
const { init, info } = require("./ws");

try {(async () => {

console.log("Qat Module"); const mGlobal = measureStart();
await init();
info(`Qat Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }
