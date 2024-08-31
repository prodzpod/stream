const WebSocket = require("ws");
const { log, warn, verbose, info } = require("./ws");
const { measureStart, listFiles, path, measureEnd } = require("./common");
const { getEvent } = require("./event/session_welcome");
const { fetch } = require("./api");
let ws = undefined, retryAttempt = 0, commands = {}, retrying = false;
module.exports.init = async () => {
    retrying = true;
    if (ws?.readyState === 1) ws.terminate();
    const subs = await fetch("GET", "eventsub/subscriptions");
    if (subs[0] === 200) for (const d of subs[1]?.data) if (d.status === 'enabled') await fetch("DELETE", "eventsub/subscriptions", {id: d.id});
    log("Loading EventSub"); const mGlobal = measureStart();
    log("Loading Events"); const mEvents = measureStart();
    for (const fname of (await listFiles("src/twitch/event")).filter(x => x.endsWith(".js")).map(x => x.slice(0, -".js".length)))
        commands[fname.split("/").at(-1)] = require(path("src/twitch/event", fname)).execute ??
        (() => { warn("command", fname, "execute does not exist, skipping"); });
    log(`Loaded ${Object.keys(commands).length} events, duration: ${measureEnd(mEvents)}ms`);
    log("Connecting to wss://eventsub.wss.twitch.tv/ws");
    ws = new WebSocket("wss://eventsub.wss.twitch.tv/ws");
    ws.on("open", _ => {
        log("logged into wss://eventsub.wss.twitch.tv/ws")
        retrying = false;
    });
    ws.on("message", async raw => {
        let req = JSON.parse(raw.toString());
        let cmd = req.metadata.message_type;
        if (cmd === "notification") {
            cmd = getEvent(req.metadata.subscription_type, req.payload.subscription.condition).replace(/\./g, "_");
            req = req.payload.event;
        } else req = req.payload;
        if (commands[cmd]) {
            verbose("eventsub recieved:", cmd, req);
            const res = commands[cmd](req); 
            if (res instanceof Promise) await res;
            if (cmd === "session_welcome") {
                info(`Eventsub Loaded, duration: ${measureEnd(mGlobal)}ms`);
                retryAttempt = 0;
            }
        }
    });
    ws.on("close", code => {
        if (retrying) return;
        /*
        if (retryAttempt < 3) { log(`Eventsub Closed (${code}), reconnecting (attempt ${retryAttempt})`); module.exports.init(); }
        else warn(`Eventsub cannot be connected after ${retryAttempt} attempts, please check your network, twitch setting and reconnect`);
        */ info("Eventsub Closed");
        process.exit(1);
    });
}

module.exports.end = () => { if (ws?.readyState === 1) ws.close(); }