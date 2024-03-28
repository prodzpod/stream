const fs = require('fs');
const { readdir } = require('node:fs/promises');
const path = require('path');
const { performance } = require('node:perf_hooks');
// files
module.exports.fileExists = (...p) => {
    try {
        fs.accessSync(path.join(...p));
        return true;
    } catch (e) { return false; }
}
module.exports.listFiles = (...dir) => {
    async function openDir(dirname, basepath = '') {
        let dir = await readdir(dirname, { withFileTypes: true });
        let i = 0;
        while (i < dir.length) {
            if (dir[i].isFile()) dir[i] = basepath + dir[i].name;
            else if (dir[i].isDirectory()) {
                let files = await openDir(path.join(dirname, dir[i].name), basepath + dir[i].name + '/');
                dir.splice(i, 1, ...files);
                i += files.length - 1;
            }
            else {
                dir.splice(i, 1);
                i--;
            }
            i++;
        }
        return dir;
    }
    return new Promise(resolve => openDir(path.join(...dir)).then(resolve));
}
// ws
module.exports.waitList = {
    main: {},
    discord: {},
    twitch: {},
    model: {},
    obs: {},
    web: {}
}
// measurement
let perfs = {};
let perfMarkers = 0;
module.exports.measureStart = () => {
    perfs[perfMarkers.toString()] = performance.now();
    return perfMarkers++;
}
module.exports.measureEnd = k => {
    if (typeof k == 'number') k = k.toString();
    let ret = performance.now() - perfs[k];
    delete perfs[k];
    return ret;
}
// main-specific
module.exports.reload = (...file) => {
    let key = require.resolve(path.join(...file));
    delete require.cache[key]; 
    return require(key);
}