const { measureStart, measureEnd, nullish } = require("./common"); 
const { init, info, log } = require("./ws");

try {(async () => {

const mGlobal = measureStart();
await init();
info(`social Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

require("./site/bluesky").init();
require("./site/masto").init();
// require("./site/tumblr").init();
// require("./site/twitter").init();

})();} catch (e) { console.log(e.stack); }