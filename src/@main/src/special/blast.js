const { src, send, data } = require("../..");
const { random, Math, numberish, WASD, delay, randomHex } = require("../../common");
const { path } = require("../../commonServer");
const { args } = require("../chat/chat");
const fs = require("fs");
module.exports.predicate = "!blast";
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let res = Array(Math.floor(random(10, 100))).fill(0).map(x => randomHex(8).toUpperCase());
    send("gizmo", "charity", "-", "", random(2, 20), "USD", "FOR THE america !!!!!!!!!");
    send("gizmo", "charity2", res.map(x => numberish(x).toString(16).padStart(8, "0")).join("\n"));
}