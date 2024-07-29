const { data, src, send } = require("../..");
const { time } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async title => {
    const cat = data().stream.category;
    data("stream", {
        category: cat,
        title: `🌟𝙋𝙕𝙋𝘿🌙 ${title}`,
        subject: (title.match(/\[[^\]]+\]/)?.[0].slice(1, -1)) ?? 'gizmos',
        start: time(),
        phase: 0
    });
    log("Title Changed: ", title, await send("twitch", "info", cat, "🌟𝙋𝙕𝙋𝘿🌙 " + title));
    return [0, ""];
}