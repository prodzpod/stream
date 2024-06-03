//* #REGION file operation !! SERVER
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
module.exports.path = (...dir) => path.join(__dirname, "../../", ...dir);
module.exports.fileExists = (...p) => { try { fs.accessSync(module.exports.path(...p)); return true; } catch (e) { return false; }}
module.exports.listFiles = (...dir) => {
    async function openDir(dirname, basepath = "") {
        let dir = fs.readdirSync(dirname, { withFileTypes: true });
        let i = 0;
        while (i < dir.length) {
            if (dir[i].isFile()) dir[i] = basepath + dir[i].name;
            else if (dir[i].isDirectory()) {
                const files = await openDir(path.join(dirname, dir[i].name), basepath + dir[i].name + "/");
                dir.splice(i, 1, ...files);
                i += files.length - 1;
            }
            else { dir.splice(i, 1); i--; }
            i++;
        }
        return dir;
    }
    return new Promise(resolve => openDir(module.exports.path(...dir)).then(resolve));
}
module.exports.open = (...path) => {
    if (path[0].trim().toLowerCase().startsWith("https://") || path[0].trim().toLowerCase().startsWith("http://")) import("open").then(open => open.default(path.join("/")));
    else exec(module.exports.path(...path)).unref();
    module.exports.debug("opened file or website:", path);
}
const http = require("http"), https = require("https"), Stream = require("stream").Transform;
module.exports.download = (url, ...dir) => new Promise(resolve => {
    (url.startsWith('http://') ? http : https).request(url, res => {
        let data = new Stream();
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
            let p = module.exports.path("src/@main/data", ...dir);
            if (!p.includes(".")) {
                let baseurl = url;
                if (baseurl.includes('?')) baseurl = baseurl.slice(0, baseurl.indexOf('?'));
                if (baseurl.includes('#')) baseurl = baseurl.slice(0, baseurl.indexOf('#'));
                if (baseurl.includes('//')) baseurl = baseurl.slice(baseurl.indexOf('//') + '//'.length);
                let ext = baseurl.split('.');
                ext = ext[ext.length - 1];
                if (ext.includes("/")) ext = "png";
                else baseurl = baseurl.slice(0, -1 - ext.length);
                const name = baseurl.replace(/%/g, "").replace(/\//g, "+");
                p += `/${name}.${ext}`;
            }
            fs.writeFileSync(p, data.read());
            resolve(p);
        });
        res.on('error', () => resolve(null));
    }).end();
});
//* #REGION debug operation !! SERVER
let LOG_LEVEL = 0;
const LEVEL_TO_COLOR = { "-2": 237, "-1": 8, "0": 15, "1": 159, "2": 226, "3": 9 };
const LEVEL_TO_TEXT = { "-999": "ALL", "-2": "VERBOSE", "-1": "DEBUG", "0": "LOG", "1": "INFO", "2": "WARN", "3": "ERROR", "999": "NONE" };
module.exports._log = (arr, logLevel=0) => {
    if (LOG_LEVEL > logLevel) return;
    console.log(`\x1b[38;5;${LEVEL_TO_COLOR[logLevel]}m[${LEVEL_TO_TEXT[logLevel]}/${formatDate("hh:mm:ss")}]`, ...arr, "\x1b[0m");
}
module.exports.error = (...x) => module.exports._log(x, 3);
module.exports.warn = (...x) => module.exports._log(x, 2);
module.exports.info = (...x) => module.exports._log(x, 1);
module.exports.log = (...x) => module.exports._log(x, 0);
module.exports.debug = (...x) => module.exports._log(x, -1);
module.exports.verbose = (...x) => module.exports._log(x, -2);
module.exports.setLogLevel = n => {
    if (typeof n === "string") n = Object.keys(LEVEL_TO_TEXT).find(x => LEVEL_TO_TEXT[x] === n.toUpperCase()) ?? 0;
    LOG_LEVEL = n; return n;
}
const { performance } = require("node:perf_hooks");
const { formatDate } = require("./common");
let perfs = {};
let perfMarkers = 0;
module.exports.measureStart = () => {
    perfs[perfMarkers.toString()] = performance.now();
    return perfMarkers++;
}
module.exports.measureEnd = k => {
    if (typeof k === "number") k = k.toString();
    const ret = performance.now() - perfs[k];
    delete perfs[k];
    return ret;
}