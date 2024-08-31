const { fetch } = require("../api");

module.exports.execute = async () => {
    await fetch("GET", "https://id.twitch.tv/oauth2/validate");
    return [0, "pong"];
}