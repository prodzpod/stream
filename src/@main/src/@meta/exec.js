const fs = require("fs");
const http = require("http");
const https = require("https");
const WebSocket = require("ws");
const { exec, spawn } = require("child_process");
const { data, src, send } = require("../..");
const { WASD, trueish, nullish, numberish, array, unstringify, realtype, looselyEqual, BigMath, Math, random, occurance, zeroPad, randomHex, ID_ADJECTIVE, ID_NOUN, getIdentifier, split, remove, unique, intersect, group, zip, lastFindIndex, lastFind, safeAssign, unentry, transpose, filterKey, filterValue, mapKey, mapValue, Color, time, formatTime, formatDate, ascii, unicode, bits, unbits, btow, wtob, utoa, atou, utow, wtou, IDN_REGIONS, idn, deidn, idnChar, deidnChar, md5, delay } = require("../../common");
const { path, fileExists, listFiles, open, download, setLogLevel, error, warn, info, log, debug, verbose, measureStart, measureEnd } = require("../../commonServer");
const { args } = require("../chat/chat");
const STREAMER_LOGIN = "prodzpod";
const STREAMER_ID = "140410053";
const CLONK_ID = "866686220";
const BOT_ID = "g584kjzcj1tr15ouxg0fko2ybnckxh";
const getID = (name) => Object.values(data().user).find(x => x.twitch?.login.toLowerCase() === name.toLowerCase()).twitch.id;

module.exports.predicate = "!exec";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    try { 
        let ret = eval(split(text, " ", 1)[1] ?? "");
        if (ret instanceof Promise) ret = await ret;
        if (typeof ret === "object") ret = WASD.pack(ret);
        _reply(ret);
        return [0, ret]; 
    } catch (e) {
        _reply("error: " + e + "\n" + e.stack);
        return [-1, e];
    }
}