const { data, send } = require("../..")
const { random, unentry, nullish, split } = require("../../common");
const { args } = require("./chat");
const ALT_CHANCE = 0.3;

module.exports.grantRandom = (user, category="common", apply = true) => {
    const global = data().icon[category];
    const chatter = data().user[user]?.economy?.icons;
    const modifier = data().icon.modifier;
    if (!chatter) return {error: "user does not exist" };
    const _icon = global.filter(x => !Object.keys(chatter).includes(x) || !chatter[x].alt || chatter[x].modifiers.length < Object.keys(modifier).length);
    if (!_icon.length) return {error: "unlocked all icons" };
    return module.exports.grantType(user, category + "/" + random(_icon), apply);
}

module.exports.grantType = (user, _icon, apply = true) => {
    let icon = { icon: _icon };
    const chatter = data().user[user]?.economy?.icons;
    const modifier = data().icon.modifier;
    if (!chatter[icon.icon]) { // new
        icon.alt = random() < ALT_CHANCE;
        icon.modifiers = [];
        for (let k in modifier) if (random() < modifier[k].chance) icon.modifiers.push(k);
    } else { // duplicate
        if (chatter[icon.icon].modifiers.length === Object.keys(modifier).length) {
            icon.alt = true; icon.modifiers = []; 
        } else {
            icon.alt = random() < ALT_CHANCE;
            icon.modifiers = [random(unentry(Object.keys(modifier).filter(x => !chatter[icon.icon].modifiers.includes(x)).map(x => [x, modifier[x].chance])))];
        }
    }
    return module.exports.grant(user, icon, apply);
}

module.exports.grant = (user, icon, apply = true) => {
    let icons = data().user[user]?.economy?.icons;
    if (!icons) return {error: "user does not exist" };
    icons[icon.icon] ??= {}; 
    icons[icon.icon].modifiers ??= [];
    if (icon.alt) icons[icon.icon].alt = icon.alt;
    if (icon.modifiers) for (const k of icon.modifiers) 
        if (!icons[icon.icon].modifiers.includes(k)) icons[icon.icon].modifiers.push(k);
    data(`user.${user}.economy.icons`, icons);
    if (apply) {
        let _icon = data().user[user].economy.icon;
        _icon.icon = icon.icon;
        _icon.alt = icon.alt ?? false;
        _icon.modifier = icon.modifier?.[0] ?? null;
        data(`user.${user}.economy.icon`, _icon);
    }    
    return [icon.icon, icons[icon.icon]];
}

module.exports.grantFromUser = (from, to, apply = true) => {
    const icon = data().user[from]?.economy?.icon;
    if (!icon) return {error: "user does not exist" };
    return module.exports.grant(to, icon, apply);
}

module.exports.grantAlt = (user, icon, apply = true) => {
    return module.exports.grant(user, { icon: icon, alt: true, modifiers: [] }, apply);
}

module.exports.grantAllModifier = (user, icon, apply = true) => {
    const modifier = Object.keys(data().icon.modifier);
    return module.exports.grant(user, { icon: icon, alt: false, modifiers: modifier }, apply);
}

module.exports.predicate = "!grant";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text) => {
    const _args = args(text);
    const target = Object.values(data().user).find(x => x.twitch?.login.toLowerCase() === _args[0].toLowerCase());
    if (nullish(target) === null) { _reply("invalid target"); return [0, ""] }
    const icon = split(_args[1], "/", 1);
    if (!data().icon[icon[0]]?.includes(icon[1])) { _reply("invalid icon"); return [0, ""] }
    let ret = module.exports.grantType(target.twitch.id, icon.join("/"), false);
    _reply("granted " + icon.join("/") + " to " + target.twitch.name + "!");
    send("web", "changeIcon", target.twitch.id, ret[0], ret[1]);
    return [0, ""];
}