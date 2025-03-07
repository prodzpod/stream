const { fetch } = require("../api");
const { BOT_ID } = require("../common");
module.exports.execute = () => {
    const params = {
        response_type: "code",
        client_id: BOT_ID,
        redirect_uri: "https://prod.kr/v/oauth",
        scope: SCOPE.join(" ")
    };
    return [0, "https://id.twitch.tv/oauth2/authorize?" + Object.entries(params).map(x => x[0] + "=" + x[1]).join("&")];
}

const SCOPE = [
    "bits:read",
    "channel:manage:ads",
    "channel:manage:broadcast",
    "channel:manage:moderators",
    "channel:manage:polls",
    "channel:manage:predictions",
    "channel:manage:raids",
    "channel:manage:redemptions",
    "channel:manage:vips",
    "channel:read:redemptions",
    "channel:moderate",
    "chat:edit",
    "chat:read",
    "clips:edit",
    "moderator:manage:announcements",
    "moderator:manage:banned_users",
    "moderator:manage:chat_messages",
    "moderator:manage:shoutouts",
    "moderator:read:chatters",
    "moderator:read:followers",
    "user:manage:whispers",
    "user:read:chat",
    "user:read:subscriptions",
    "user:write:chat",
];