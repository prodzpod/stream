const { exec } = require("child_process");
const { path, error, warn, info, log, debug, verbose, fileExists } = require("../../commonServer");
const fs = require("fs");
const { send } = require("../..");
const { delay } = require("../../common");
let modules = {}, logs = {};
module.exports.start = async (dir, logStdOut=false, isExternal=false) => {
    const mainDirectory = isExternal ? "external" : "src";
    if (modules[dir]) {
        await send(dir, "end");
        const res = modules[dir].kill();
        logs[dir].end();
        info("Module Restarted:", dir, res);
    } else info("Module Started:", dir);
    fs.writeFileSync(path(mainDirectory, dir, "latest.log"), "");
    modules[dir] = exec(fs.readFileSync(path(mainDirectory, dir, "index.bat")).toString(), { cwd: path(mainDirectory, dir) });
    logs[dir] = fs.createWriteStream(path(mainDirectory, dir, "latest.log"));
    modules[dir].stdout.pipe(logs[dir]); modules[dir].stderr.pipe(logs[dir]);
    if (logStdOut) {
        modules[dir].stderr.on('data', data => error(dir, data));
        modules[dir].stdout.on('data', data => {
            data = data.toString().trim();
            if (data.startsWith("[ERROR] ")) error(`[${dir}]`, data.slice("[ERROR] ".length));
            else if (data.startsWith("[WARN] ")) warn(`[${dir}]`, data.slice("[WARN] ".length));
            else if (data.startsWith("[INFO] ")) info(`[${dir}]`, data.slice("[INFO] ".length));
            else if (data.startsWith("[LOG] ")) log(`[${dir}]`, data.slice("[LOG] ".length));
            else if (data.startsWith("[DEBUG] ")) debug(`[${dir}]`, data.slice("[DEBUG] ".length));
            else if (data.startsWith("[VERBOSE] ")) verbose(`[${dir}]`, data.slice("[VERBOSE] ".length));
            else log(`[${dir}]`, data);
        });
    }
    return [0, dir];
}
module.exports.end = async dir => {
    if (!modules[dir]) { warn("Module is not started:", dir, ", skipping"); return [1, ""]; }
    await send(dir, "end");
    const res = modules[dir].kill();
    delete modules[dir];
    logs[dir].end();
    delete logs[dir];
    info("Module Ended:", dir, res);
    return [0, dir];
}