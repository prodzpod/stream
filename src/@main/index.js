//? PROD@MAIN
//? Language: Javascript
//? Control Flow: 
//?   [v] accept ws from other modules
//?   [v] interact with data
//?   [v] send ws to corresponding modules

const fs = require("fs");
const WebSocket = require("ws");
const { WASD, numberish, split, Math, nullish, safeAssign } = require("./common");
const { warn, _log, info, error, listFiles, path, measureStart, log, measureEnd, fileExists, debug, verbose } = require("./commonServer");
const { initModules, streamModules } = require("../..");
let server = undefined, sockets = {}, ID = 0, waitList = {};
const STATUS_OK = 0, STATUS_REJECT = 1, STATUS_ERR = -1;
let commands = {}, data = {}, src = {};
module.exports.init = async () => {
    info("prod@MAIN: initialized"); const mGlobal = measureStart();
    // #REGION loading cmds --------------------------------------------------------------
    log("@main: Loading Commands"); const mCommand = measureStart();
    for (const fname of (await listFiles("src/@main/command")).filter(x => x.endsWith(".js")).map(x => split(x.slice(0, -".js".length), "/", 1))) {
        const [type, file] = fname; commands[type] ??= {}; commands[type][file.split("/").at(-1)] = require(path("src/@main/command", type, file)).execute ?? (() => { warn("command", fname, "execute does not exist, skipping"); }); 
    }
    log(`@main: ${Math.sum(Object.values(commands).map(x => Object.keys(x).length))} commands loaded! duration: ${Math.prec(measureEnd(mCommand))}ms`);
    // #REGION loading data --------------------------------------------------------------
    log("@main: Loading Data"); const mData = measureStart();
    for (const fname of (await listFiles("src/@main/data")).filter(x => x.endsWith(".wasd")).map(x => x.slice(0, -".wasd".length))) {
        const fpath = fname.split("/"); let walk = data;
        for (const s of fpath.slice(0, -1)) { if (!walk[s]) walk[s] = {}; walk = walk[s]; }
        try { walk[fpath.at(-1)] = WASD.unpack(fs.readFileSync(path("src/@main/data", fname + ".wasd")))[0]; } catch { warn("data", fname, "is not a valid WASD file, skipping"); walk[fpath.at(-1)] = {}; }
    }
    log(`@main: ${JSON.stringify(data).length} characters of data loaded! duration: ${Math.prec(measureEnd(mData))}ms`);
    // #REGION loading src --------------------------------------------------------------
    log("@main: Loading Source"); const mSrc = measureStart();
    for (const fname of (await listFiles("src/@main/src")).filter(x => x.endsWith(".js")).map(x => x.slice(0, -".js".length))) { 
        src[fname.split("/").at(-1)] = require(path("src/@main/src", fname)) ?? { execute: (() => { warn("src", fname, "execute does not exist, skipping"); }) }; 
    }
    log(`@main: ${Object.keys(src).length} sources loaded! duration: ${Math.prec(measureEnd(mSrc))}ms`);
    // # REGION loading server --------------------------------------------------------------
    log("@main: Loading Server"); const mServer = measureStart();
    if (server) await new Promise(resolve => server.close(x => resolve(x)));
    server = new WebSocket.Server({ port: 339 });
    server.on("connection", (ws, req) => {
        const fullname = req.url.slice(1);
        const name = fullname.split("/")[0];
        sockets[fullname] = ws;
        this.log(fullname, 1, "opened connection");
        ws.on("message", async msg => {
            msg = WASD.unpack(msg.toString());
            if (msg.length < 2) { this.log(name, 3, "message has insufficient params:", msg); return; };
            const id = msg[0], command = msg[1].toString().trim().toLowerCase(); let args = [...fullname.split("/").slice(1), ...msg.slice(2)];
            this.log(fullname, -2, "message recieved:", command, ...args);
            let status, res;
            if (command === "log") { module.exports.log(fullname, ...args); return; }
            else if (command === "respond") { module.exports.respond(fullname, id, ...args); return; }
            else try {
                let execute = commands[name][command];
                if (!execute) { args = [name, ...args]; execute = commands['@common'][command]; }
                if (!execute) {
                    this.log(fullname, initModules.includes(fullname) ? 2 : -2, command, "does not exist, skipping");
                    status = STATUS_ERR; res = WASD.pack("does not exist");
                } else {
                    let ret = execute(...args);
                    if (ret instanceof Promise) ret = await ret;
                    if (Array.isArray(ret) && ret.length === 2) [status, res] = ret;
                    else {
                        this.log(fullname, 2, command, ",", args, "does not return valid values:", ret);
                        status = STATUS_ERR; res = ret;
                    }
                }
            } catch (e) { status = STATUS_ERR; res = WASD.pack(e.stack); }
            this.log(fullname, -2, id, "message processed:", status, res);
            ws.send(WASD.pack(id, "respond", status, res));
        });
        ws.on("close", () => {
            this.log(fullname, 1, "closed connection")
            if (streamModules.includes(fullname) && data.stream.phase >= 0) {
                this.log(fullname, 2, "erroneous closure, rebooting...");
                src.module.start(fullname, true);
            }
        });
        ws.on("error", e => error(fullname, "error:", e.stack));
    });
    log(`Server Set Up! duration: ${Math.prec(measureEnd(mServer))}ms`);
    if (data.stream.phase >= 0) for (const module of streamModules) src.module.start(module, true);
    // #REGION done 4 now --------------------------------------------------------------
    info(`prod@MAIN Ready! duration: ${Math.prec(measureEnd(mGlobal))}ms`);
}

module.exports.send = (dest, ...args) => {
    if (sockets[dest]?.readyState !== 1) return (initModules.includes(dest) ? warn : verbose)(dest + " websocket is not active, skipping send");
    ID++; sockets[dest].send(WASD.pack(ID, ...args));
    return new Promise(resolve => { waitList[ID] = resolve; });
}

module.exports.respond = (from, id, status, ...args) => {
    this.log(from, -2, `respond id "${id}":`, status, ...args);
    if (status === STATUS_OK) {
        if (waitList[id] === undefined) 
            this.log(from, 2, `resolve id "${id}"`, 'does not have any resolves, skipping');
        else {
            waitList[id](...args);
            delete waitList[id];
        }
    } else if (status === STATUS_REJECT) {
        this.log(from, 0, `respond id ${id} rejected:`, ...args);
    } else {
        this.log(from, 3, `respond id ${id} ERROR:`, status, ...args);
    }
}

module.exports.log = (from, ...args) => {
    let loglevel = 0;
    if (args.length > 1 && typeof numberish(args[0]) === "number") { loglevel = Number(args[0]); args = args.slice(1); }
    args = [`[${from}]`, ...args];
    _log(args, loglevel);
}
module.exports.commands = () => commands;
module.exports.src = () => src;
module.exports.setCommand = (type, v, cmd) => commands[type][v] = cmd;
module.exports.setSrc = (v, cmd) => src[v] = cmd;
module.exports.data = (pth, value) => {
    if (!nullish(pth)) return data;
    const t = traverse(pth);
    t.data.data[t.data.key] = safeAssign(t.data.data[t.data.key], value);
    fs.writeFileSync(path(`src/@main/data/${t.file.path.join("/")}.wasd`), WASD.pack(t.file.data[t.file.key]));
    debug("Written data:", t.data.path.join("/"), "value", t.data.data[t.data.key]);
};
module.exports.incrementData = (pth, value=1) => {
    if (!nullish(pth)) return data;
    const t = traverse(pth);
    t.data.data[t.data.key] ??= 0;
    t.data.data[t.data.key] += value;
    fs.writeFileSync(path(`src/@main/data/${t.file.path.join("/")}.wasd`), WASD.pack(t.file.data[t.file.key]));
    debug("Written data:", t.data.path.join("/"), "value", t.data.data[t.data.key]);
};
function traverse(pth) {
    if (typeof pth === "string") pth = pth.replaceAll("/", ".").replaceAll("\\", ".").split(".");
    let ret = { file: { path: [pth[0]], data: data, key: pth[0] }, data: { path: [pth[0]], data: data, key: pth[0] } };
    let foundFile = fileExists(`src/@main/data/${ret.file.path.join("/")}.wasd`);
    while (pth.length > 1) {
        pth = pth.slice(1); const p = pth[0];
        if (!foundFile) {
            if (!fileExists(`src/@main/data/${ret.file.path.join("/")}`)) 
                fs.mkdirSync(path(`src/@main/data/${ret.file.path.join("/")}`));
            ret.file.data = ret.file.data[ret.file.key];
            ret.file.key = p; ret.file.path.push(p);
            if (fileExists(`src/@main/data/${ret.file.path.join("/")}.wasd`)) foundFile = true;
        }
        ret.data.data = ret.data.data[ret.data.key]; 
        ret.data.key = p; ret.data.path.push(p);
    }
    return ret;
}