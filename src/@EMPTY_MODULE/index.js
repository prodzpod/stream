const { measureStart, measureEnd } = require("./common"); 
const { init, info } = require("./ws");

try {(async () => {

const mGlobal = measureStart();
await init();
info(`EMPTY_MODULE Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }
