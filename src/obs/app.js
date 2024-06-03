const WebSocket = require("ws");
const { delay, randomHex } = require("./common");
const { error, warn, log } = require("./ws");

let ws, messages = {};
module.exports.init = async () => {
    log("WS Connecting Attempt Begin");
    let connected = false;
    while (!connected) {
        ws = new WebSocket("ws://localhost:4455");
        ws.on("open", _ => { log("WS Connected"); ws.send(JSON.stringify({ "op": 1, "d": { "rpcVersion": 1 }})); connected = true; });
        ws.on("error", _ => {});
        ws.on("close", _ => { log("WS closed"); process.exit(0); })
        await delay(100);
    }
    messages = {};
    ws.on("message", str => {
        let evt = JSON.parse(str.toString());
        // if (evt.op === 5 && getSocketsServer(this.ID)) getSocketsServer(this.ID).send(`void 0 ${evt.eventType} ${JSON.stringify(evt.eventData)}`);
        if (evt.op === 7 && messages[evt.d.requestId]) { messages[evt.d.requestId](evt.d); delete messages[evt.d.requestId]; }
    });
}

module.exports.send = (name, data) => {
    if (ws?.readyState !== 1) return warn("OBS WS is not active");
    let id = `${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}-${randomHex(12)}`;
    ws.send(JSON.stringify({
        "op": 6,
        "d": {
          "requestType": name,
          "requestId": id,
          "requestData": data
        }
    }));
    return new Promise(resolve => messages[id] = resolve);
}
module.exports.sendByName = async (name, scene, source, data) => {
    const d = await this.send("GetSceneItemId", {
        "sceneName": scene,
        "sourceName": source
    });
    return await this.send(name, Object.assign(data, {
        "sceneName": scene,
        "sceneItemId": d.responseData.sceneItemId
    }));
}