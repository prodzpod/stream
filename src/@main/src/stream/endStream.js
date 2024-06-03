const { src, data, send } = require("../..");
const { streamModules } = require("../../../..");
const { info } = require("../../commonServer");
const { end } = require("../@meta/module");
module.exports.predicate = "!endstream";
module.exports.permission = false;
module.exports.execute = (_reply, from, chatter, message, text, reply) => {
    info("Ending Stream Sequence");
    data("stream", {
        title: '🌟𝙋𝙕𝙋𝘿🌙 Currently Offline',
        subject: null,
        category: 'Software and Game Development',
        start: -1,
        phase: -1
    });
    send("twitch", "info", data().stream.category, data().stream.title);
    src().obs.brb(); src().obs.end();
    src().marker.sendInfo();
    for (const module of streamModules) end(module, true);
    return [0, ""];
}