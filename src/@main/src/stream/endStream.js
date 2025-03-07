const { src, data, send } = require("../..");
const { streamModules } = require("../../../..");
const { info, fileExists, listFiles, path, log } = require("../../commonServer");
const { end } = require("../@meta/module");
const fs = require("fs");
module.exports.predicate = "!endstream";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    info("Ending Stream Sequence");
    src().marker.updateInfo("sgd", "Currently Offline", -1);
    src().obs.brb(); src().obs.end();
    for (const module of streamModules) end(module, true);
    src().startWeekly.end();
    module.exports.backup();
    return [0, false];
}

module.exports.backup = async () => {
    for (let f of (await listFiles("src/@main/data")).filter(x => x.endsWith(".wasd")))
        await new Promise(resolve => fs.copyFile(path("src/@main/data", f), require("path").join(process.env.GIZMO_DATA_BACKUP_LOCATION, f), resolve));
    info("Backup Completed");
}