const { src, send } = require("../..");

module.exports.execute = async (id) => {
    const data = (await send("twitch", "user", id));
    return [0, data ? { name: data.display_name, color: data.color, profile: data.profile_image_url, created: data.created_at } : ""];
}