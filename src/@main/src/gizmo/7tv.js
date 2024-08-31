const { send, data } = require("../..");
const { nullish } = require("../../common");
const { log, download, shell, fileExists, warn, path } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!7tv";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    log(_args);
    let id = _args[0].split("/").at(-1);
    let res = await (await fetch(`https://7tv.io/v3/emotes/${id}`)).json();
    if (nullish(_args[1]) === null) _args[1] = res.name;
    let file = res.host.files.find(x => x.format === "WEBP") ?? res.host.files[0];
    let url = `https:${res.host.url}/${file.name}`;
    log("Downloading 7TV Emote", _args[1], `(ID: ${_args[0]})`);
    let ret = await module.exports.get(url, _args[1], file.format.toLowerCase(), file.frame_count > 1);
    if (ret) { let r = data().emote["7tv"]; r[ret[0]] = ret[1]; data("emote.7tv", r); }
    else warn("Emote", _args[1], "Already Exists!");
    _reply(ret ? "Emote Added!" : "Emote with this name already exists.");
    return [ret ? 0 : 1, ""];
}

module.exports.get = async (url, name, format, isGif) => {
    name = name.replace(/\W/g, "_"); format = format.toLowerCase();
    let desiredFormat = isGif ? "gif" : "png";
    if (fileExists(`src/@main/data/emote/7tv/${name}.${desiredFormat}`)) return [name, `src/@main/data/emote/7tv/${name}.${desiredFormat}`];
    await download(url, "emote/7tv", `${name}.${format}`);
    if (format !== desiredFormat) {
        await shell(`magick.exe convert -dispose Previous -coalesce src/@main/data/emote/7tv/${name}.${format} src/@main/data/emote/7tv/${name}.${desiredFormat}`);
        require("fs").unlinkSync(path(`src/@main/data/emote/7tv/${name}.${format}`));
    }
    if (isGif) await shell(`python src/@main/data/emote/extractFrames.py src/@main/data/emote/7tv/${name}.${desiredFormat}`);
    return [name, `src/@main/data/emote/7tv/${name}.${desiredFormat}`];
}