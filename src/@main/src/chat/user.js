const { data, send } = require("../..");
const { nullish, BigMath, time, random, numberish } = require("../../common");
const { log, download } = require("../../commonServer");

module.exports.identify = chatter => {
    const category = Object.keys(chatter)[0];
    if (!category) return null;
    return Object.values(data().user ?? {}).find(x => x[category]?.id == chatter[category].id) ?? chatter;
}
module.exports.register = chatter => {
    if (!chatter.twitch) return;
    data(`user.${chatter.twitch.id}`, chatter);
}

module.exports.initialize = async (id, forceBlockUpdate=false) => {
    let chatter = Object.values(data().user ?? {}).find(x => x.twitch?.id == id) ?? { twitch: {id: id} };
    let updateThis = nullish(chatter.meta) === null;
    chatter.meta ??= {};
    chatter.economy ??= {};
    chatter.economy.weekly ??= 0;
    chatter.economy.iu ??= 0;
    chatter.economy.icon ??= { icon: "", alt: false, modifier: null };
    chatter.economy.icons ??= {};
    if (!Object.keys(chatter.economy.icons).length) {
        const icon = random(data().icon.common);
        chatter.economy.icon.icon = "common/" + icon;
        chatter.economy.icons["common/" + icon] = { alt: false, modifiers: [] };
    }
    chatter.economy.pointer ??= {};
    chatter.economy.pointers ??= {};
    if (!Object.keys(chatter.economy.pointers).length) {
        const pointers = data().pointer.cursor.sprite;
        chatter.economy.pointers.cursor = pointers;
        for (const k of pointers) chatter.economy.pointer[k] = "cursor";
    }
    chatter.shimeji ??= {};
    chatter.shimeji.sprite ??= null;
    chatter.shimeji.ai ??= {};
    for (let category of [
        "dexterity", // how often do your guy move (min delay)
        "jokerness", // variance of the delay between moves (max delay)
        "agility", // how far do your guy move at once
        "jumpness", // how often do your guy jump
        "zebraness", // variance of jump height
        "jumpheight", // how far do your guy jump
        "camelness", // how far do your guy jump horizontally
        "wisdom", // how often is your guy attracted to elements
        "aggression", // how often do your guy try to hit stuff
        "strength", // how far do your guy hit stuff
        "bisonness", // how far do your guy hit stuff vertically
        "luck", // variance of your guy hitting stuff distance
        "banananess", // reserved
        "orangeness", // reserved
    ]) chatter.shimeji.ai[category] ??= { max: 2, value: 1 };
    // combat stats
    chatter.shimeji.ai.appleness ??= 2;
    chatter.shimeji.ai.constitution ??= 100;
    chatter.shimeji.ai.attack ??= 10;
    chatter.shimeji.ai.defense ??= 0;
    chatter.shimeji.ai.critchance ??= 0.05;
    chatter.shimeji.ai.critdamage ??= 2.5;
    chatter.shimeji.ai.multihit ??= 1;
    chatter.shimeji.ai.attackspeed ??= 4;
    chatter.shimeji.ai.oxness ??= 0; // how much your guy want to charge towards other guy
    chatter.shimeji.ai.hipponess ??= 0.1; // how often do your guy like to engage combat
    // chatter.shimeji.ai.loveliness ??= 5;
    // chatter.shimeji.ai.eepiness ??= 5;
    chatter.shimeji.stats ??= {};
    chatter.shimeji.history ??= {};
    chatter.meta.last_chatted ??= 0;
    if (chatter.twitch && (time() - BigInt(chatter.twitch.last_updated ?? 0)) > TWITCH_UPDATE_PERIOD) {
        chatter = await twitchUpdate(chatter);
        updateThis = true;
    }
    chatter.meta.last_interacted ??= 0;
    chatter.meta.permission = {
        streamer: chatter.twitch?.badges?.includes("broadcaster-1") ?? false,
        mod: chatter.twitch?.badges?.includes("moderator-1") ?? false,
        vip: chatter.twitch?.badges?.includes("vip-1") ?? false,
    }
    if (updateThis && !forceBlockUpdate) {
        log("Updating User", chatter.twitch?.name);
        data(`user.${chatter.twitch.id}`, chatter);
    }
    chatter.clonkspotting ??= {};
    chatter.clonkspotting.boost ??= 0;
    chatter.clonkspotting.spotted ??= [];
    return chatter;
}

const TWITCH_UPDATE_PERIOD = BigInt(1000*60*60*24);
const TWITCH_INFO_MAP = {
    "login": "login",
    "display_name": "name",
    "description": "description",
    "profile_image_url": "profile_image",
    "offline_image_url": "offline_image",
    "created_at": "created_at",
    "color": "color",
}
async function twitchUpdate(chatter) {
    let _twitch = await send("twitch", "user", chatter.twitch?.id);
    if (!_twitch?.id) return chatter;
    for (let k of Object.keys(TWITCH_INFO_MAP)) if (_twitch[k]) chatter.twitch[TWITCH_INFO_MAP[k]] = _twitch[k];
    if (chatter.twitch.profile_image) chatter.twitch.profile = await download(chatter.twitch.profile_image, "user", chatter.twitch.id + ".twitch.png");
    chatter.twitch.last_updated = time();
    if (chatter.discord?.profile_image) chatter.discord.profile = await download(chatter.discord.profile_image + "?size=300", "user", chatter.twitch.id + ".discord.png");
    // (login bonus)
    return chatter;
}

module.exports.cost = (_reply, chatter, iu) => {
    if (!chatter?.twitch?.id || !chatter.economy) { _reply("invalid chatter"); return false; }
    iu = numberish(chatter.economy.iu) - iu;
    if (iu < 0) { _reply("not enough iu"); return false; }
    data(`user.${chatter.twitch.id}.economy.iu`, iu);
    send("web", "iu", chatter.twitch.id, iu);
    return true;
}