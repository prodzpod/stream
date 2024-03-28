const { listFiles, reload, fileExists, measureStart, measureEnd } = require("../util_server");
const { commands, log, warn, error } = require("../include");
const { unstringify, safeAssign, isNullish, takeWord } = require('../util_client');

module.exports.reload = async (path, str) => {
    if (Array.isArray(path)) path = require('path').join(...path);
    let measure = measureStart();
    names = unstringify(str);
    if (!names) names = await listFiles(path);
    if (typeof names === 'string') names = [names];
    log('Reloading files:', names);
    let files = {};
    for (let file of names) {
        file = file.trim();
        if (fileExists(path, file) && file.endsWith('.js')) files[file.slice(0, -('.js'.length))] = reload(path, file);
        else if (fileExists(path, file + '.js')) files[file] = reload(path, file + '.js');
        else warn('File', file, 'does not exist, skipping');
    }
    if (isNullish(files)) {
        log('No files are reloaded');
        measureEnd(measure);
        return null;
    }
    try {
        let ks = Object.keys(files);
        log(ks.length === 1 ? `Reloaded ${ks[0]}!` : `Reloaded ${ks.length} files!`, `Duration: ${measureEnd(measure)}ms`);
        return files;
    } catch (e) {
        error(e);
        measureEnd(measure);
        return null;
    }
}
module.exports.condition = 'reload';
module.exports.execute = async str => {
    if (str?.startsWith('reload')) str = takeWord(str)[1];
    let files = await this.reload(__dirname, str);
    if (!isNullish(files)) safeAssign(commands, files);
    return isNullish(files);
}