const { measureStart, measureEnd } = require("./common"); 
const { init, info } = require("./ws");

try {(async () => {

console.log("GPT Module"); const mGlobal = measureStart();
await init();
info(`GPT Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }
