const { WASD, path, nullish, fetch } = require("../common");
const { Social } = require("../social");
const { log, error, warn } = require("../ws");
const fs = require("fs");
const FormData = require("form-data");
let ACCOUNTS = {};

const f = (key) => fetch({ "Authorization": "Bearer " + ACCOUNTS[key][0] });
module.exports.init = async () => {
    ACCOUNTS = WASD.unpack(fs.readFileSync(path("../secret/twitter_token.wasd")).toString())[0];
    let social = new Social("twitter", Object.keys(ACCOUNTS));
    social.connect = async key => {
        // test dummy oauth
        try {
            let r = await f(key)("GET", `api.x.com/2/users/me`, {}, {}, "application/json");
            if (r[0] === 200) return key;
        } catch {}
        // refresh
        let res = await f(key)("POST", "api.x.com/2/oauth2/token", null, {
            "grant_type": "refresh_token",
            "client_id": process.env.TWITTER_CLIENT_ID,
            "refresh_token": ACCOUNTS[key][1]
        });
        if (res[0] !== 200) { error(`twitter@${key} oauth is corrupted! please manually kickstart this`, res); return null; }
        ACCOUNTS[key] = [res[1].access_token, res[1].refresh_token];
        fs.writeFileSync(path("../secret/twitter_token.wasd"), WASD.pack(ACCOUNTS));
        log(`Refreshed oauth: twitter@${key}!`);
        return key;
    }
    social.post = async (key, txt, images, tags) => {
        let ret = { "text": txt };
        if (tags?.length) ret.text += "\n" + tags.map(x => "#" + x.replace(/\S+/g, "_")).join(" ");
        if (images?.length) {
            ret.media = { media_ids: [] }
            for (let image of images) {
                try {
                    let b = await f(key)("POST", "https://upload.twitter.com/1.1/media/upload.json", {}, {
                        command: "INIT",
                        total_bytes: image.bytes,
                        media_type: image.type
                    });
                    if (b[0] !== 200) return null;
                    ret.media.media_ids.push(b[1].media_id);
                    let file = fs.readFileSync(image.path);
                    for (let i = 0; i < image.bytes; i += 2000000) {
                        let a = new FormData();
                        a.append("command", "APPEND");
                        a.append("media_id", b[1].media_id);
                        a.append("media_data", file.subarray(i, i + 2000000).toString('base64'));
                        a.append("segment_index", i / 2000000);
                        let c = await f(key)("POST", "https://upload.twitter.com/1.1/media/upload.json", {}, a, "multipart/form-data");
                        if (c[0] !== 200) return null;
                    }
                    let d = await f(key)("POST", "https://upload.twitter.com/1.1/media/upload.json", {}, {
                        command: "FINALIZE",
                        media_id: b[1].media_id
                    });
                    if (d[0] !== 200) return null;
                    while (true) {
                        let e = await f(key)("GET", "https://upload.twitter.com/1.1/media/upload.json", {}, {
                            command: "STATUS",
                            media_id: b[1].media_id
                        });
                        if (e[0] !== 200) return null;
                        if (e[1].processing_info.state === "succeeded") break;
                        else if (e[1].processing_info.state === "failed") return null;
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                } catch { return null; }
            }
        }
        try {
            const res = await f(key)("POST", "api.x.com/2/tweets", null, ret, "application/json");
            if (res[0] === 201) return res[1].data.id;
            warn(key, txt, images, tags, ret, ...res);
        } catch (e) { error(key, txt, images, tags, ret, e); }
        return null;
    }
    social.repost = async (key, id) => {
        try {
            let acc = await f(key)("GET", `api.x.com/2/users/me`, {}, {}, "application/json");
            if (acc[0] !== 200) { warn(key, id, ...acc); return null; }
            let res = await f(key)("POST", `api.x.com/2/users/${acc[1].data.id}/retweets`, null, { tweet_id: id }, "application/json");
            if (res[0] !== 201) { warn(key, id, ...acc, ...res); return null; }
            return res[1].data;
        }
        catch (e) { error(e, key, id); return null; }
    }
    social.validate = async (agent, txt, images, tags) => (txt?.length ?? 0) < 280;
}