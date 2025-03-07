const { measureStart, measureEnd } = require("./common"); 
const { init, info } = require("./ws");

try {(async () => {

const mGlobal = measureStart();
await init();
await require("./app").init();
info(`witsend Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }
