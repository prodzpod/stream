const Bluesky = require("@atproto/api");
let agent;
module.exports.init = async () => {
    agent = new Bluesky.AtpAgent({ service: "https://bsky.social" });
    await agent.login({
        identifier: process.env.BLUESKY_ID,
        password: process.env.BLUESKY_PASSWORD
    });
}

module.exports.post = async (text, image) => {
    await agent.post({
        text: text,
        createdAt: new Date().toISOString()
    })
}