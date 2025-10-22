const WebSocket = require("ws");
const { WASD, listFiles, path, measureStart, measureEnd } = require("./common"); 
const STATUS_OK = 0, STATUS_REJECT = 1, STATUS_ERR = -1;
let ws = undefined, commands = {}, waitList = {};

const MODULE_NAME = "social"; //! change this every folder

module.exports.init = async () => {
    const mGlobal = measureStart();
    for (const fname of (await listFiles(`src/${MODULE_NAME}/command`)).filter(x => x.endsWith(".js")).map(x => x.slice(0, -".js".length))) {
        commands[fname.split("/").at(-1)] = require(path(`src/${MODULE_NAME}/command`, fname)).execute ?? (() => { module.exports.warn("command", fname, "execute does not exist, skipping"); }); 
    }
    if (ws?.readyState === 1) ws.terminate();
    await new Promise(resolve => {
        ws = new WebSocket(`ws://localhost:339/${MODULE_NAME}`, { skipUTF8Validation: true, maxRedirects: 999 });
        ws.on("open", () => {
            module.exports.info(`${MODULE_NAME} module connected, time: ${measureEnd(mGlobal)}ms`); 
            resolve();
        });
        ws.on("message", async msg => {
            let args = WASD.unpack(msg);
            const id = args[0], command = args[1]; args = args.slice(2);
            module.exports.verbose("message recieved:", id, command, ...args);
            let status, res;
            if (command === "respond") { module.exports.respond(id, ...args); return; }
            else try {
                const execute = commands[command];
                if (!execute) {
                    module.exports.log(command, "does not exist, skipping");
                    status = STATUS_ERR; res = WASD.pack("does not exist");
                } else {
                    let ret = execute(...args);
                    if (ret instanceof Promise) ret = await ret;
                    if (Array.isArray(ret) && ret.length === 2) [status, res] = ret;
                    else {
                        module.exports.warn(command, ",", args, "does not return valid values:", ret);
                        status = STATUS_ERR; res = ret;
                    }
                }
            } catch (e) { status = STATUS_ERR; res = WASD.pack(e.stack); }
            module.exports.verbose(id, "message processed:", status, res);
            ws.send(WASD.pack(id, "respond", status, res));        
        });
        ws.on("close", e => console.log(e));
        ws.on("error", e => console.log(e));
    });
    return 0;
}

let ID = 0;
module.exports.send = (...args) => {
    if (ws?.readyState !== 1) { console.error("MAIN DOES NOT EXIST: ", ...args); return; } //! no ws to send logs
    ID++; ws.send(WASD.pack(ID, ...args));
    return new Promise(resolve => waitList[ID] = resolve);
}
module.exports.respond = (id, status, ...args) => {
    module.exports.verbose(`respond id "${id}":`, status, ...args);
    if (status === STATUS_OK) {
        if (waitList[id] === undefined) 
            module.exports.warn(`resolve id "${id}"`, 'does not have any resolves, skipping');
        else {
            waitList[id](...args);
            delete waitList[id];
        }
    } else if (status === STATUS_REJECT) {
        module.exports.log(`respond id ${id} rejected:`, ...args);
    } else {
        module.exports.error(`respond id ${id} ERROR:`, ...args);
    }
}
module.exports.close = (code = 1000) => { if (ws?.readyState === 1) ws.close(code); }
module.exports.error = (...x) => { console.log("[ERROR]", ...x); }
module.exports.warn = (...x) => { console.log("[WARN]", ...x); }
module.exports.info = (...x) => { console.log("[INFO]", ...x); }
module.exports.log = (...x) => { console.log("[LOG]", ...x); }
module.exports.debug = (...x) => { console.log("[DEBUG]", ...x); }
module.exports.verbose = (...x) => { console.log("[VERBOSE]", ...x); }