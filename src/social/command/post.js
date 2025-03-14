const { post, repost, validate } = require("../social");
const { log } = require("../ws");

module.exports.execute = async (o) => {
    let ids = {};
    for (let key in o.tags) {
        if (typeof o.tags[key] === "string") continue;
        if (await validate(key, o.text, o.images ?? [], o.tags[key] ?? [])) continue;
        return [1, "validation failed"];
    }
    for (let key in o.tags) if (typeof o.tags[key] !== "string") 
        ids[key] = await post(key, o.text, o.images ?? [], o.tags[key] ?? []);
    for (let key in o.tags) if (typeof o.tags[key] === "string") 
        await repost(key, ids[o.tags[key]]);
    return [0, "posted!"];
}