const { exec } = require("child_process")
const { info, listFiles, path, fileExists, log } = require("../../commonServer")
const { start } = require("../@meta/module");
const { streamModules } = require("../../../..");
const { unlinkSync } = require("fs");

module.exports.execute = async () => {
    info("Preparing For Stream");
    log("Starting Files");
    for (const fname of await listFiles("src/@main/data/links/stream")) exec(path("src/@main/data/links/stream", fname)).unref();
    log("Starting Modules");
    for (const module of streamModules) start(module, true);
}