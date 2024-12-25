const { src, data, send } = require("../..");
const { streamModules } = require("../../../..");
const { info, fileExists, listFiles, path, log } = require("../../commonServer");
const { end } = require("../@meta/module");
const { unlinkSync } = require("fs");
module.exports.predicate = "!endstream";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    info("Ending Stream Sequence");
    src().marker.updateInfo("sgd", "Currently Offline", -1);
    src().obs.brb(); src().obs.end();
    for (const module of streamModules) end(module, true);
    src().startWeekly.end();
    require("fs").writeFile(path("src/@main/data/backup.sh"), "#!/usr/bin/env sh\n" + (await listFiles("src/@main/data"))
        .filter(x => x.endsWith(".wasd"))
        .map(x => `scp ${path("src/@main/data", x)} ${"$p/../data/" + x}`)
        .join("\n"), () => info("Backup shell script generated"));
    return [0, ""];
}