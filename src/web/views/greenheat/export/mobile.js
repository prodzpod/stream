const DEBUG = false;
let channel, login, user, ws, config;
window.Twitch.ext.onAuthorized(auth => {
    channel = auth.channelId;
    user = auth.userId;
    if (!initialized) init();
    if (!user.startsWith("U") && !user.startsWith("A")) removeElement("login");
});
let latency = 0;
window.Twitch.ext.onContext(ctx => {
    latency = ctx.hlsLatencyBroadcaster;
});
let initialized = false;
async function init() {
    initialized = true;
    e("login").addEventListener("pointerdown", event => event.stopPropagation());
    e("login").addEventListener("pointerup", event => event.stopPropagation());
    e("login").addEventListener("mousemove", event => event.stopPropagation());
    e("link-account").addEventListener("click", _ => window.Twitch.ext.actions.requestIdShare());
    e("stay-anonymous").addEventListener("click", _ => removeElement('login'));
    login = (await (await fetch("https://prod.kr/api/twitchloginfromid?id=" + channel)).json()).res;
    initWS();
    config = await (await fetch("https://heat.prod.kr/" + channel + "/config")).json()
    if (!config.detections.includes("mobile")) return;
    e("heat").classList.add("active");
    if (config.detections.includes("click")) e("heat").addEventListener("touchstart", event => clickScreen(event));
    if (config.detections.includes("release")) e("heat").addEventListener("touchend", event => releaseScreen(event));
    if (config.detections.includes("drag")) e("heat").addEventListener("touchmove", event => hoverScreen(event));
};
function initWS() {
    console.log("[GreenHeat] logged in to", "wss://heat.prod.kr/" + login + "/extension", "!");
    ws = new WebSocket("wss://heat.prod.kr/" + login + "/extension");
    ws.onclose = () => {
        console.log("Websocket Disconnected, reconnecting...");
        setTimeout(initWS, 5000);
    }
}

function getData(event) {
    let ratio = (1920 / e("heat").clientWidth) / (1080 / e("heat").clientHeight);
    let x = event.changedTouches[0].pageX / e("heat").clientWidth;
    let y = event.changedTouches[0].pageY / e("heat").clientHeight;
    if (ratio < 1) x /= ratio;
    else y /= ratio;
    return {
        id: user,
        x: x,
        y: y,
        button: "left",
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        time: new Date().getTime(),
        latency: latency
    };
}
let pressed = false,
    lastCoord = null;

function clickScreen(event) {
    let data = getData(event);
    pressed = true;
    lastCoord = [data.x, data.y];
    data.type = "click";
    ws.send(data);
    let dot = insertElement("div", "overlay", "clickdot").with("style", `left: ${event.changedTouches[0].pageX}px; top: ${event.changedTouches[0].pageY}px;`);
    setTimeout(() => {
        removeElement(dot);
    }, 500);
}

function releaseScreen(event) {
    let data = getData(event);
    pressed = false;
    lastCoord = [data.x, data.y];
    data.type = "release";
    ws.send(data);
}

function hoverScreen(event) {
    let data = getData(event);
    if (!lastCoord) lastCoord = [data.x, data.y];
    let coord = [data.x, data.y];
    if (Math.hypot((coord[0] - lastCoord[0]) * 1920, (coord[1] - lastCoord[1]) * 1080) >= config.sensitivity) {
        lastCoord = coord;
        data.type = "drag";
        ws.send(data);
    }
}

function send(data) {
    if (DEBUG) e("debug").innerText = "sending " + JSON.stringify(data);
    ws.send(JSON.stringify(data));
}