const { src, data, send } = require("../..");
const { time } = require("../../common");
const { info } = require("../../commonServer");
const { args } = require("../chat/chat");
module.exports.predicate = "!marker";
module.exports.permission = false;
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    info("Starting Stream Sequence");
    module.exports.updateInfo(_args[0], _args[1]);
    return [0, ""];
}

module.exports.updateInfo = (category, name, phase) => {
    if (phase === undefined) phase = Number(data().stream.phase) + 1;
    category = Object.keys(ALIASES).find(x => ALIASES[x].includes(category)) ?? category;
    if (name === undefined) name = data().stream.title;
    else name = `🌟𝙋𝙕𝙋𝘿🌙 ${name}`;
    let start = data().stream.start;
    if (phase === -1) start = -1;
    else if (phase === 0) start = time();
    let subject = (name.match(/\[[^\]]+\]/)?.[0].slice(1, -1)) ?? 'gizmos';
    data("stream", {
        category: category,
        title: name,
        subject: subject,
        start: start,
        phase: phase
    });
    send("twitch", "info", category, name);
    send("gizmo", "info", subject, phase, category);
}

const ALIASES = {
    'Software and Game Development': ['sgd', 'software', 'gamedev', 'code', 'program', 'coding', 'programming'],
    'Science & Technology': ['st', 'tech', 'science', 'technology'],
    'Just Chatting': ['jc', 'chat', 'yap', 'chatting'],
    'Music': ['composing', 'compose', 'music'],
    'TETR.IO': ['tetris', 'tetr', 'tetrio'],
    'The Stanley Parable: Ultra Deluxe': ['stanley parable', 'the stanley parable'],
    'Mahjong Soul': ['mahjong', 'jong'],
    'Jackbox Party Packs': ['jackbox'],
    'Bloons TD 6': ['bloons', 'btd6'],
    'VRChat': ['vrc', 'vrchat'],
    'Linux for PlayStation 2': ['ps2', 'linux'],
    'Games + Demos': ['demo', 'demos', 'beta', 'betas'],
    'Retro': ['retro'],
    'Yume 2kki': ['2kki', 'yno'],
    'Collective Unconscious': ['cu']
};