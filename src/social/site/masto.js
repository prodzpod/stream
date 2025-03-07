const { Social } = require("../social");
const { split, fetch } = require("../common");
const { log, error, warn } = require("../ws");
const fs = require("fs");
const FormData = require("form-data");
const ACCOUNTS = {
    "prod@mastodon.gamedev.place": process.env.MASTO_TOKEN,
    "prod@mas.to": process.env.MASTO_TOKEN_PERSONAL,
}
module.exports.init = async () => {
    let social = new Social("masto", Object.keys(ACCOUNTS));
    social.connect = async key => key;
    social.post = async (key, txt, images, tags) => {
        let ret = { status: txt };
        if (tags?.length) ret.status += "\n" + tags.map(x => "#" + x.replace(/\S+/g, "")).join(" ");
        if (images?.length) {
            ret.media_ids = [];
            for (let image of images) {
                try {
                    let a = new FormData();
                    a.append("file", fs.createReadStream(image.path));
                    let b = await fetch({ "Authorization": "Bearer " + ACCOUNTS[key] })("POST", split(key, "@", 1)[1] + "/api/v2/media", null, a, "multipart/form-data");
                    if (b[0] !== 200) { warn(key, txt, images, tags, ret, ...b); return null; }
                    ret.media_ids.push(b[1].id);
                } catch (e) { error(e); return null; }
            }
        }
        try {
            let res = await fetch({ "Authorization": "Bearer " + ACCOUNTS[key] })("POST", split(key, "@", 1)[1] + "/api/v1/statuses", null, ret);
            if (res[0] === 200) return key;
            warn(key, ret, res);
            return null;
        } catch (e) { error(e, key, txt, images, tags); return null; }
    }
    social.repost = async (key, id) => {
        try {
            let f = fetch({ "Authorization": "Bearer " + ACCOUNTS[key] });
            let s = split(key, "@", 1)[1];
            let acc = await f("GET", s + "/api/v2/search/", { q: "@" + id, type: "accounts" });
            if (acc[0] !== 200) { warn(key, id, acc); return null; }
            let post = await f("GET", s + "/api/v1/accounts/" + acc[1].accounts[0].id + "/statuses", { "limit": 1 });
            if (post[0] !== 200) { warn(key, id, post); return null; }
            let res = await f("POST", s + "/api/v1/statuses/" + post[1][0].id + "/reblog", null);
            if (res[0] === 200) return res[1];
            warn(key, id, res);
            return null;
        } catch (e) { error(e, key, id); return null; }
    }
    social.validate = async (agent, txt, images, tags) => (txt?.length ?? 0) < 500;
}