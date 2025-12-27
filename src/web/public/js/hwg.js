const DEBUG = false;
const MODS = [];
let CHANNEL_NAME, ON_START, ON_RESIZE, ON_MESSAGE, ON_DRAW, ON_CONTROL;
window.onload = async () => {
    removeElement("bg");
    CHANNEL_NAME = DEBUG ? "pooltoybot" : "prodzpod";
    initializeRenderer();
    window.onresize();
    await initializeWebsocket();
    await initializeControl();
    if (ON_START) await ON_START();
}

window.onresize = async () => {
    document.getElementById("main").width = Math.max(1, window.innerWidth);
    document.getElementById("main").height = Math.max(1, window.innerHeight);
    if (ON_RESIZE) await ON_RESIZE();
}

// render

let RENDER_CURSORS = true;
const TARGET_FPS = 60;
let canvas, ctx;
function initializeRenderer() {
    canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");
    loopRender();
}

let nextSecond = 1000;
function loopRender() {
    // start
    let start = Date.now();
    // do the actual thing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = "none";
    if (ON_DRAW) ON_DRAW(canvas, ctx);
    // cursor
    if (RENDER_CURSORS) {
        for (const k of Object.keys(cursors)) if (start - cursors[k].time >= 1000) delete cursors[k];
        for (const cursor of Object.values(cursors)) {
            let filter = `opacity(${100 - ((start - cursor.time) / 10)}%)`;
            ctx.filter = filter;
            ctx.drawImage(getSprite("sprite-cursor"), cursor.x, cursor.y);
            if (cursor.name !== "") {
                ctx.fillStyle = cursor.color;
                ctx.fillText(cursor.name, cursor.x + 32, cursor.y + 32);
            }
        }
    }
    // end
    let end = Date.now();
    let timeLeft = (1000 / TARGET_FPS) - (end - start);
    if (timeLeft <= 0) setTimeout(loopRender, 1);
    else setTimeout(loopRender, timeLeft);
}

let SPRITE_CACHE = {};
function getSprite(id) {
    SPRITE_CACHE[id] ??= document.getElementById(id);
    return SPRITE_CACHE[id];
}

// ID: { name: string, color: color, time: number, x: number, y: number }
let cursors = {};
function addCursor(message) {
    cursors[message.id] = {
        name: message.name,
        color: message.color,
        time: message.time,
        x: message.x,
        y: message.y
    };
}

// websocket

function initializeWebsocket() {
    return new Promise(resolve => {
        let ws = new WebSocket("wss://heat.prod.kr/" + CHANNEL_NAME);
        ws.onopen = () => {
            console.log("Connected to GreenHeat!");
            resolve();
        }
        ws.onmessage = async (_message) => {
            let message = JSON.parse(_message.data);
            // transform obs resolution normalized to window by pixel
            message.x *= 1920;
            message.y *= 1080;
            // latency calculation
            message.timeAdjusted = message.time - (message.latency) * 1000;
            // isAnonymous
            message.isAnonymous = message.id.startsWith("A") || message.id.startsWith("U");
            message = await getUser(message);
            if (!message.name) message.name = message.login ?? "";
            if (!message.color) message.color = "white";
            addCursor(message);
            handleMessages(message); // mutex
        }
        ws.onclose = () => {
            console.log("WebSocket closed, reconnecting...");
            setTimeout(initializeWebsocket, 500);
        }
    });
}

let ws;
function initializeControl() {
    return new Promise(resolve => {
        ws = new WebSocket("wss://prod.kr/hwg");
        ws.onopen = () => {
            console.log("Connected to prod.kr!");
            resolve();
        }
        ws.onmessage = async (_message) => {
            let message = WASD.unpack(_message.data)[0];
            if (ON_CONTROL) await ON_CONTROL(message);
        }
        ws.onclose = () => {
            console.log("WebSocket closed, reconnecting...");
            setTimeout(initializeControl, 500);
        }
    });
}
function send(...data) {
    ws.send(WASD.pack(0, ...data));
}

let queue = [];
async function handleMessages(message) {
    if (queue.length) { await new Promise(resolve => queue.push(resolve)); queue.splice(0, 1); }
    queue.splice(0, 0, "processing");
    if (ON_MESSAGE) await ON_MESSAGE(message);
    else console.log("Message Recieved:", message);
    queue.splice(0, 1);
    if (queue.length) queue[0](); // resolve next
}

let userCache = {}
async function getUser(data) {
    if (data.isAnonymous) return data;
    if (!userCache[data.id]) userCache[data.id] = (await (await fetch("https://prod.kr/api/twitchprofilefromid?id=" + data.id)).json()).res;
    data = Object.assign(data, userCache[data.id])
    return data;
}