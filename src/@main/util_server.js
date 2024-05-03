const fs = require('fs');
const { readdir } = require('node:fs/promises');
const path = require('path');
const { performance } = require('node:perf_hooks');
const Stream = require('stream').Transform;
const http = require('http');
const https = require('https');
const { utow, isNullOrWhitespace } = require('./util_client');
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
module.exports.saveFile = (url, ...dir) => new Promise(resolve => {
    (url.startsWith('http://') ? http : https).request(url, res => {
        let data = new Stream();
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
            let p = path.join(...dir);
            if (!p.includes(".")) {
                let baseurl = url;
                if (baseurl.includes('?')) baseurl = baseurl.slice(0, baseurl.indexOf('?'));
                if (baseurl.includes('#')) baseurl = baseurl.slice(0, baseurl.indexOf('#'));
                if (baseurl.includes('//')) baseurl = baseurl.slice(baseurl.indexOf('//') + '//'.length);
                let ext = baseurl.split('.');
                ext = ext[ext.length - 1];
                if (ext.includes("/")) ext = "png";
                else baseurl = baseurl.slice(0, -1 - ext.length);
                let name = baseurl.replace(/%/g, "").replace(/\//g, "+");
                p = path.join(p, `${name}.${ext}`);
            }
            fs.writeFileSync(p, data.read());
            resolve(p);
        });
        res.on('error', () => resolve(null));
    }).end();
});

module.exports.toModelURL = p => {
    if (isNullOrWhitespace(p)) return "Content/sprites/joel1";
    return path.relative(path.join(__dirname, "../model"), p).replace(/\.\w+$/, "");
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