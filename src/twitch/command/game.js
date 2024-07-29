const { fetch } = require("../api");
module.exports.execute = async name => {
    name = Object.keys(ALIASES).find(x => ALIASES[x].includes(name)) ?? name;
    const res = await fetch("GET", "games", {name: name});
    if (res[0] !== 200) return [-1, res[1]];
    else if (res[1].data.length) return [0, res[1].data[0].id];
    return [1, ""];
}

const ALIASES = {
    'Software and Game Development': ['sgd', 'software', 'gamedev', 'code', 'program', 'coding', 'programming'],
    'Science & Technology': ['st', 'tech', 'science', 'technology'],
    'Just Chatting': ['jc', 'chat', 'yap', 'chatting'],
    'Music': ['composing', 'compose'],
    'TETR.IO': ['tetris', 'tetr', 'tetrio'],
    'The Stanley Parable: Ultra Deluxe': ['stanley parable', 'the stanley parable'],
    'Mahjong Soul': ['mahjong'],
    'Jackbox Party Packs': ['jackbox'],
    'Bloons TD 6': ['bloons', 'btd6'],
    'VRChat': ['vrc', 'vrchat'],
    'Linux for PlayStation 2': ['ps2', 'linux']
};