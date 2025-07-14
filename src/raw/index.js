const { measureStart, measureEnd, path } = require("./common"); 
const { init, info, log, error } = require("./ws");
const { spawn } = require("child_process");
try {(async () => {

const mGlobal = measureStart();
await init();
info(`raw Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }

let py;
function start(...args) {
    log("Loading Raw Input Handler");
    py = spawn("python", [path("src/raw/index.py"), ...args]);
    py.stdout.on("data", x => log(String(x)));
    py.stderr.on("data", x => error(String(x)));
    py.on("spawn", x => log("Handler Triggered"));
    py.on("error", error);
}
module.exports.start = (...args) => { start(...args); }