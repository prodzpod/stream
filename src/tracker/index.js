const { measureStart, measureEnd, path, retry } = require("./common");
const { init, info, send, log, verbose, debug, error } = require("./ws");
const dgram = require("dgram");
const { spawn } = require("child_process");
let i = 0;
let server;
try {(async () => {

console.log("Loading Tracker Module"); const mGlobal = measureStart();
await init();
log("Initializing datagram Server");
server = dgram.createSocket("udp4")
function t(arr, offset, amount=1, chunk=4) {
    let ret = [];
    for (let i = 0; i < amount; i++)
        ret = [...ret, ...(arr.slice(offset + (i * chunk), offset + (i * chunk) + chunk)/*.reverse()*/)];
        return ret;
}
server.on("message", (msg, _) => { 
    let arr = Array.from(new Uint8Array(msg.buffer));
    arr = new Uint8Array([t(arr, 0, 1, 8), t(arr, 20, 2), t(arr, 33, 4+3+3), t(arr, 1753, 3+3), t(arr, 1777, 2)].flat());
    send("data", Buffer.from(arr).toString("base64"));
});
server.on("error", error);
server.on("close", () => {
    if (stop) return;
    log("dgram server closed, reconnecting");
    server.bind(11573, undefined, () => resolve());
});
await new Promise(resolve => server.bind(11573, undefined, () => resolve()));
start();
info(`Tracker Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { error(e.stack); }

let py;
function start() {
    log("Loading OpenSeeFace");
    py = spawn("python", [path("src/tracker/OpenSeeFace/facetracker.py")]);
    py.on("spawn", x => log("OpenSeeFace loaded"));
    py.stdout.on("data", x => {
        // log(x.toString());
        i++; if (i % 1000 === 0) log("Tracker Heartbeat", x?.toString().slice(0, 10));
    });
    py.stderr.on("data", x => { error(x.toString()); });
    py.on("close", x => {
        info("Face Tracker Closed", x);
        if (stop) return;
        start();
    });
    py.on("error", error);
}
let stop = false;
module.exports.end = () => { stop = true; py.kill(); server.close(); }