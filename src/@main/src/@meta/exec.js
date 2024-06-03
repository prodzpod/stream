const { data, src, send } = require("../..");
const { WASD, trueish, nullish, numberish, array, unstringify, realtype, looselyEqual, BigMath, Math, random, String, occurance, zeroPad, randomHex, ID_ADJECTIVE, ID_NOUN, getIdentifier, split, remove, unique, intersect, group, zip, lastFindIndex, lastFind, safeAssign, unentry, transpose, filterKey, filterValue, mapKey, mapValue, Color, time, formatTime, formatDate, ascii, unicode, bits, unbits, btow, wtob, utoa, atou, utow, wtou, IDN_REGIONS, idn, deidn, idnChar, deidnChar, md5, delay } = require("../../common");
const { path, fileExists, listFiles, open, setLogLevel, error, warn, info, log, debug, verbose, measureStart, measureEnd } = require("../../commonServer");
const { args } = require("../chat/chat");
const { download } = require("./image");

module.exports.predicate = "!exec";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, reply) => {
    try { 
        ret = eval(split(text, " ", 1)[1] ?? "");
        _reply(ret);
        return [0, ret]; 
    } catch (e) {
        _reply("error: " + e + "\n" + e.stack);
        return [-1, e];
    }
}