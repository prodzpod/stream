const { src, data, send } = require("../..");
const { nullish, time, numberish } = require("../../common");
module.exports.execute = async (text) => {
    let input = text.toLowerCase();
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
                if (text.length >= 6) points += 1;
                points += text.length;
            }
        }
        if (maxPoints < points) 
        {
            maxPoints = points;
            maxLayout = layout;
        }
        if (maxPoints >= i) { return [0, {points: maxPoints}]; }
    }
    return [0, {points: 0}];
}