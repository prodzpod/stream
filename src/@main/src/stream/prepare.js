const { exec } = require("child_process")
const { info, listFiles, path } = require("../../commonServer")
const { start } = require("../@meta/module");
const { streamModules } = require("../../../..");

module.exports.execute = async () => {
    info("Preparing For Stream");
    for (const fname of await listFiles("src/@main/data/links/stream")) exec(path("src/@main/data/links/stream", fname)).unref();
    for (const module of streamModules) start(module, true);
}