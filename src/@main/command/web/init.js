const { data, src } = require("../..");
const { nullish, getIdentifier } = require("../../common");
const { log } = require("../../commonServer");
module.exports.execute = async (hash, category) => {
    const _data = data();
    let ret = {};
    if (nullish(hash)) {
        const user = Object.values(_data.user).find(x => x.web?.[category === "screen" ? "id" : category] === hash);
        if (user) ret = src().screen.screenData(user);
    }
    if (!ret.id) { const id = getIdentifier(); src().login.addID(category, id); ret.login = id; delete ret.id; }
    ret.streaming = _data.stream.phase !== -1;
    return [0, ret];
}