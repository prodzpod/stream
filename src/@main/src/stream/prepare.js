const { exec } = require("child_process")
const { info, listFiles, path, fileExists, log } = require("../../commonServer")
const { start } = require("../@meta/module");
const { streamModules } = require("../../../..");
const { unlinkSync } = require("fs");

module.exports.execute = async () => {
    info("Preparing For Stream");
    log("Removing Previous Backup");
    if (fileExists("src/gizmo2/Gizmo/StreamOverlay/backup.txt")) unlinkSync(path("src/gizmo2/Gizmo/StreamOverlay/backup.txt"));
    log("Removing Song Files");
    for (let s of (await listFiles("src/@main/data/song")).filter(x => x.startsWith("_"))) unlinkSync(path("src/@main/data/song", s));
    log("Starting Files");
    for (const fname of await listFiles("src/@main/data/links/stream")) exec(path("src/@main/data/links/stream", fname)).unref();
    log("Starting Modules");
    for (const module of streamModules) start(module, true);
}