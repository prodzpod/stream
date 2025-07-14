const { src, send, data } = require("../..");
const { random, Math, numberish, WASD, delay } = require("../../common");
const { path } = require("../../commonServer");
const { args } = require("../chat/chat");
const fs = require("fs");
module.exports.predicate = "!link";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    fs.writeFileSync(path("src/@main/data/busy.txt"), "0");
    return await src().CElink.sendce(_reply, `init ${args(text)[0] ?? ""} ${args(text)[1] ?? ""}`.trim());
}

let resolve = null;
module.exports.sendce = async (_reply, text) => {
    if (fs.readFileSync(path("src/@main/data/busy.txt")) == "1") {
        _reply("Process is currently busy. try again later");
        return [1, ""];
    }
    fs.writeFileSync(path("src/@main/data/action.txt"), text);
    await send("raw", "send", "move -1800 100"); // remoteclick
    _reply(await new Promise(_resolve => { resolve = _resolve; }));
    await delay(1000);
    await send("raw", "send", "amove 960 540"); // remoteclick
    return [0, ""];
}
module.exports.resolve = (ret) => { if (resolve) { resolve(ret); resolve = null; } }