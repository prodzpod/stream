const fs = require("fs");
const VALIDATE_RETRY_TIME = 5*60*1000; // 5 minute
const { WASD, path, nullish } = require("./common"); 
const { close, log, error, debug } = require("./ws");
const { BOT_ID } = require("./common");
let secret;
module.exports.setSecret = _secret => secret = { token: _secret[0], refresh: _secret[1] };
module.exports.validateWatchdog = async () => {
    const ret = await module.exports.validate();
    if (ret !== -1) setTimeout(() => module.exports.validateWatchdog(), VALIDATE_RETRY_TIME);
    return ret;
}
module.exports.validate = async () => {
    if ((await module.exports.fetch("GET", "https://id.twitch.tv/oauth2/validate"))[0] === 200) {
        debug("validate passed");
        return 1;
    } else {
        const res = await module.exports.fetch("POST", "https://id.twitch.tv/oauth2/token", null, {
            "grant_type": "refresh_token",
            "client_id": BOT_ID,
            "client_secret": process.env.TWITCH_BOT_SECRET,
            "refresh_token": secret.refresh
        }, true);
        if (res[0] === 200) {
            secret = { token: res[1].access_token, refresh: res[1].refresh_token };
            fs.writeFileSync(path("../secret/twitch_token.wasd"), WASD.pack(secret.token, secret.refresh));
            log("validate: token refreshed");
            await require("./eventsub").init();
            return 0;
        } else {
            error("validate failed! check ENV for client secret and please refresh and restart twitchbot.");
            close();
            return -1;
        }
    }
}
module.exports.fetch = async (method, subdir = "", query, body, isEncoded = false) => {
    if (!subdir.includes("oauth2") && (await module.exports.validate()) === -1) return;
    let options = {
        method: method, mode: "cors",
        headers: {
            "Authorization": "Bearer " + secret.token,
            "Client-Id": BOT_ID,
            "Content-Type": isEncoded ? "application/x-www-form-urlencoded" : "application/json"
        }
    };
    if (!subdir.startsWith("https://") && !subdir.startsWith("http://")) subdir = "https://api.twitch.tv/helix/" + subdir;
    if (!["HEAD", "GET"].includes(method) && body) options.body = isEncoded ? 
        Object.entries(body).filter(x => x.every(y => nullish(y))).map(x => x.map(y => encodeURIComponent(String(y))).join("=")).join("&") : 
        JSON.stringify(body);
    if (nullish(query)) subdir = `${subdir}?${Object.entries(query)
            .filter(x => x.every(y => nullish(y)))
            .map(x => x.map(y => encodeURIComponent(String(y))).join("=")).join("&")}`;
    const res = await (require("node-fetch"))(subdir, options);
    try { return [res.status, await res.json()]; } catch { return [res?.status, res?.body]; };
}