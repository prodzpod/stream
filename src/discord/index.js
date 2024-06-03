const { measureStart } = require("./common");

try {(async () => {

console.log("Loading Discord Module"); const mGlobal = measureStart();
await require("./ws").init();
await require("./app").init();

})();} catch (e) { console.log(e.stack); }