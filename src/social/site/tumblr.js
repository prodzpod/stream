const { WASD, path, nullish, fetch } = require("../common");
const { Social } = require("../social");
const { log, error, warn } = require("../ws");
const fs = require("fs");
const FormData = require("form-data");
let ACCOUNTS = {};

const f = (key) => fetch({ "Authorization": "Bearer " + ACCOUNTS[key][0] });
module.exports.init = async () => {
    ACCOUNTS = WASD.unpack(fs.readFileSync(path("../secret/tumblr_token.wasd")).toString())[0];
    let social = new Social("tumblr", Object.keys(ACCOUNTS));
    social.connect = async key => {
        // test dummy oauth
        try {
            let r = await f(key)("GET", `api.tumblr.com/v2/blog/${key}/followers`, { limit: 1 });
            if (r[0] === 200) return key;
        } catch {}
        // refresh
        let res = await f(key)("POST", "api.tumblr.com/v2/oauth2/token", null, {
            "grant_type": "refresh_token",
            "client_id": process.env.TUMBLR_KEY_STARTELLERS,
            "client_secret": process.env.TUMBLR_SECRET_STARTELLERS,
            "refresh_token": ACCOUNTS[key][1]
        });
        if (res[0] !== 200) { error(`${key}.tumblr.com oauth is corrupted! please manually kickstart this`, res); return null; }
        ACCOUNTS[key] = [res[1].access_token, res[1].refresh_token];
        fs.writeFileSync(path("../secret/tumblr_token.wasd"), WASD.pack(ACCOUNTS));
        log(`Refreshed oauth: ${key}.tumblr.com!`);
        return key;
    }
    social.post = async (key, txt, images, tags) => {
        let ret = { content: [{"type": "text", "text": txt}] };
        if (tags?.length) ret.tags = tags.map(x => x.replaceAll(",", " ")).join(",");
        let ret2 = new FormData();
        for (let i in images ?? []) ret.content.push({
            "type": images[i].type.startsWith("image") ? "image" : "video", 
            "media": [{ 
                "type": images[i].type,  
                "identifier": "images-" + i,
                "width": images[i].width,
                "height": images[i].height,
            }]
        });
        ret2.append("json", JSON.stringify(ret));
        for (let i in images ?? []) ret2.append("images-" + i, fs.createReadStream(images[i].path));
        try {
            let res = await f(key)("POST", `api.tumblr.com/v2/blog/${key}/posts`, null, ret2, "multipart/form-data");
            if (res[0] === 201) return { key: key, id: res[1].response.id };
            warn(key, txt, images, tags, ret, ...res);
        } catch (e) { error(key, txt, images, tags, ret, e); }
        return null;
    }
    social.repost = async (key, id) => {
        try {
            let post = await f(key)("GET", `api.tumblr.com/v2/blog/${id.key}/posts/${id.id}`);
            if (post[0] !== 200) { warn(key, id, ...post); return null; }
            let res = await f(key)("POST", `api.tumblr.com/v2/blog/${key}/posts`, null, { content: [], parent_tumblelog_uuid: id.key, parent_post_id: id.id, reblog_key: post[1].response.reblog_key }, "application/json");
            if (res[0] !== 201) { warn(key, id, ...post, ...res); return null; }
            return res[1].response;
        }
        catch (e) { error(e, key, id); return null; }
    }
}