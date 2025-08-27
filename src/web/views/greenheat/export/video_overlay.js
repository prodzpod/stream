const DEBUG = false;
let channel, login, user, ws, config;
window.Twitch.ext.onAuthorized(auth => {
    channel = auth.channelId;
    user = auth.userId;
    if (!initialized) init();
    if (!user.startsWith("U") && !user.startsWith("A")) removeElement("login-wrapper");
});
let latency = 0;
window.Twitch.ext.onContext(ctx => {
    latency = ctx.hlsLatencyBroadcaster;
});
let initialized = false, lastRightClicked = [null, null, 0];
async function init() {
    initialized = true;
    e("login").addEventListener("pointerdown", event => event.stopPropagation());
    e("login").addEventListener("pointerup", event => event.stopPropagation());
    e("login").addEventListener("mousemove", event => event.stopPropagation());
    e("link-account").addEventListener("click", _ => window.Twitch.ext.actions.requestIdShare());
    e("stay-anonymous").addEventListener("click", _ => removeElement('login-wrapper'));
    login = (await (await fetch("https://prod.kr/api/twitchloginfromid?id=" + channel)).json()).res;
    initWS();
    config = await (await fetch("https://heat.prod.kr/" + channel + "/config")).json()
    e("heat").classList.add("active");
    if (config.detections.includes("click")) {
        e("heat").addEventListener("pointerdown", event => clickScreen(event));
        e("heat").addEventListener("dblclick", event => { event.preventDefault(); event.stopPropagation(); });
        e("heat").addEventListener("contextmenu", event => { 
            let newrc = [event.layerX / e("heat").clientWidth, event.layerY / e("heat").clientHeight, new Date().getTime()];
            if (newrc[2] - lastRightClicked[2] < 500 && Math.hypot((newrc[0] - lastRightClicked[0]) * 1920, (newrc[1] - lastRightClicked[1]) * 1080) < config.sensitivity) return;
            lastRightClicked = newrc;
            event.preventDefault(); event.stopPropagation(); 
        });
    }
    if (config.detections.includes("release")) e("heat").addEventListener("pointerup", event => releaseScreen(event));
    if (config.detections.includes("hover") || config.detections.includes("drag")) e("heat").addEventListener("mousemove", event => hoverScreen(event));
    if (config.detections.includes("drag")) e("heat").addEventListener("dragmove", event => event.preventDefault());
}
function initWS() {
    console.log("[GreenHeat] logged in to", "wss://heat.prod.kr/" + login + "/extension", "!");
    ws = new WebSocket("wss://heat.prod.kr/" + login + "/extension");
    ws.onclose = () => {
        console.log("Websocket Disconnected, reconnecting...");
        setTimeout(initWS, 5000);
    }
}

function getData(event) {
    let x = event.layerX / e("heat").clientWidth;
    let y = event.layerY / e("heat").clientHeight;
    return {
        id: user,
        x: x,
        y: y,
        button: (["left", "middle", "right"])[event.button] ?? "left",
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        time: new Date().getTime(),
        latency: latency
    };
}
let pressed = null,
    lastCoord = null;

function clickScreen(event) {
    let data = getData(event);
    pressed = data.button;
    lastCoord = [data.x, data.y];
    data.type = "click";
    send(data);
    let dot = insertElement("div", "overlay", "clickdot").with("style", `left: ${event.layerX}px; top: ${event.layerY}px;`);
    setTimeout(() => {
        removeElement(dot);
    }, 500);
}

function releaseScreen(event) {
    let data = getData(event);
    pressed = null;
    lastCoord = [data.x, data.y];
    data.type = "release";
    send(data);
}

function hoverScreen(event) {
    let data = getData(event);
    if (!lastCoord) lastCoord = [data.x, data.y];
    let coord = [data.x, data.y];
    if (Math.hypot((coord[0] - lastCoord[0]) * 1920, (coord[1] - lastCoord[1]) * 1080) >= config.sensitivity) {
        lastCoord = coord;
        if (pressed && config.detections.includes("drag")) {
            data.type = "drag";
            data.button = pressed;
            send(data);
        }
        if (!pressed && config.detections.includes("hover")) {
            data.type = "hover";
            send(data);
        }
    }
}

function send(data) {
    if (DEBUG) console.log("sending", data);
    ws.send(JSON.stringify(data));
}