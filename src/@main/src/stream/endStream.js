const { src, data, send } = require("../..");
const { streamModules } = require("../../../..");
const { info, fileExists, listFiles, path, log } = require("../../commonServer");
const { end } = require("../@meta/module");
const { unlinkSync } = require("fs");
module.exports.predicate = "!endstream";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
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
    src().startWeekly.end();
    log("Removing Previous Backup");
    if (fileExists("src/gizmo2/Gizmo/StreamOverlay/backup.txt")) unlinkSync(path("src/gizmo2/Gizmo/StreamOverlay/backup.txt"));
    log("Removing Song Files");
    for (let s of (await listFiles("src/@main/data/song")).filter(x => x.startsWith("_"))) unlinkSync(path("src/@main/data/song", s));
    return [0, ""];
}