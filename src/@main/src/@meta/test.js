const { src, send, data } = require("../..");
const { WASD, array, randomHex, nullish } = require("../../common");
const { log, path } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!test";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let input = args(text)[0].toLowerCase();
    let layouts = data().woggle;
    let words = data().wogglewords;
    let maxPoints = 0;
    let maxLayout = null;
    for (let i = 18; i >= 0; i--) for (let layout of layouts[i]) {
        // todo: symbols
        let points = 0;
        for (let region of layout.regions) {
            let text = region.map(x => input[x]).sort().join("");
            if (words.includes(text)) {
                if (text.length > 6) points += 1;
                points += text.length;
            }
        }
        if (maxPoints < points) 
        {
            log("Point Record: " + points + ", " + layout.path);
            maxPoints = points;
            maxLayout = layout;
        }
        if (maxPoints >= i) { _reply(maxPoints + ": " + maxLayout.path); return [0, ""]; }
    }
    _reply(0);
    return [0, ""];
}