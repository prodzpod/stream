const fs = require("fs");
const WebSocket = require("ws");
const { log, error, info, send } = require("./ws");
let messagesSeen = 0;
let ws;
module.exports.init = () => new Promise(resolve => {
    openWS(resolve);
});

function openWS(resolve) {
    try {
        messagesSeen = Number(fs.readFileSync("./messages.txt"));
        ws = new WebSocket("ws://witsend.witscord.net/ws?since=" + messagesSeen);
        ws.onopen = () => {
            log("websocket connected");
            resolve(true);
        }
        ws.onmessage = async msg => {
            let message = JSON.parse(msg.data);
            if (message.message && !message.author.startsWith("‍")) {
                messagesSeen += 1;
                fs.writeFileSync("./messages.txt", String(messagesSeen));
                if (message.author === "[clock]" && /\[unobtrusively\] \[timestamp\/\d+\]/.test(message.message)) return;
                send("chat", messagesSeen, message.author, message.authorColor, transformFrom(message.message), message.timestamp);
            }
        }
        ws.onerror = e => { error(e); }
        ws.onclose = () => { info("websocket closed"); openWS(); }
    } catch { log("witsend API Down REAL"); }
}

module.exports.message = (author, color, message) => {
    ws?.send(JSON.stringify({
        author: "‍" + author,
        authorColor: color ?? "",
        message: transformTo(message)
    }));   
    messagesSeen += 1;
    fs.writeFileSync("./messages.txt", String(messagesSeen));
}

const TOTAL_REPLACES = {
    "[gif of a seal flopping about happily]": "http://witsend.witscord.net/sealblock.gif",
    "[gif of the letter h doing a dance]": "https://i.imgur.com/xcHifiq.gif",
    "[gif of a seal staring into the camera and then splashing everythwere]": "http://witsend.witscord.net/sealblock.gif",
    "[gif of a seal rapidly approaching through the snow]": "http://witsend.witscord.net/sealblock.gif",
}

function transformFrom(message) {
    if (TOTAL_REPLACES[message]) return TOTAL_REPLACES[message];
    if (message.startsWith("[unobtrusively]")) message = message.slice("[unobtrusively]".length).trim();
    else if (message.startsWith("[obtrusively]")) message = "‍\n# " + message.slice("[obtrusively]".length).trim();
    return message.replace(/\[timestamp\/(\d+)\]/g, "<t:$1>").replaceAll("@everyone", "**@**everyone").replaceAll("@here", "**@**here");;
}

function transformTo(message) {
    for (let k in TOTAL_REPLACES) message = message.replaceAll(TOTAL_REPLACES[k], k);
    message = message.replace(/<t\:(\d+)(?:\:\w*)?>/g, "[timestamp/$1]");
    if (message.startsWith("# ")) message = "[obtrusively] " + message.slice("# ".length);
    else if (message.startsWith("-# ")) message = "[unobtrusively] " + message.slice("-# ".length);
    return message;
}