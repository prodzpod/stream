const { measureStart, measureEnd, nullish } = require("./common"); 
const { init, info, log } = require("./ws");

try {(async () => {

const mGlobal = measureStart();
await init();
info(`social Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }