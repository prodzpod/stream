const { data } = require("../..")
const { random } = require("../../common")

module.exports.grantRandom = (user, apply = true) => {
    const global = data().pointer;
    const chatter = data().user[user]?.economy?.pointers;
    if (!chatter) return {error: "user does not exist" };
    const _pointer = Object.keys(global).filter(x => global[x].price >= 0 && (!Object.keys(chatter).includes(x) || chatter[x].length < global[x].sprite.length));
    if (!_pointer.length) return {error: "unlocked all pointers" };
    const pointer = random(_pointer);
    const mode = random(global[pointer].sprite.filter(x => !chatter[pointer].includes(x)));
    return module.exports.grant(user, pointer, mode, apply);
}

module.exports.grant = (user, pointer, mode, apply = true) => {
    let pointers = data().user[user]?.economy?.pointers;
    if (!pointers) return {error: "user does not exist" };
    pointers[pointer] ??= []; 
    if (!pointers[pointer].includes(mode)) {
        pointers[pointer].push(mode);
        data(`user.${user}.economy.pointers`, pointers);
    }
    if (apply) {
        let _pointer = data().user[user].economy.pointer;
        _pointer[mode] = pointer;
        data(`user.${user}.economy.pointer`, _pointer);
    }
    return [pointer, mode];
}

module.exports.grantAll = (user, pointer, apply = true) => {
    let pointers = data().user[user]?.economy?.pointers;
    if (!pointers) return {error: "user does not exist" };
    pointers[pointer] = data().pointer[pointer].sprite;
    data(`user.${user}.economy.pointers`, pointers);
    if (apply) {
        let _pointer = data().user[user].economy.pointer;
        for (const k of pointers[pointer]) _pointer[k] = pointer;
        data(`user.${user}.economy.pointer`, _pointer);
    }
    return pointers[pointer];
}