const { WASD, path, nullish } = require("./common");
const { log, error } = require("./ws");
const fs = require("fs");

let secret;
module.exports.setSecret = _secret => secret = { token: _secret[0], refresh: _secret[1] };

module.exports.init = async () => {
    log("Loading tumblr");
    try { module.exports.setSecret(WASD.unpack(fs.readFileSync(path("../secret/tumblr_token.wasd")).toString())); }
    catch (e) { error("tumblr_token.wasd is invalid! please refresh and restart social."); close(); return; }
    /*
    const res = await fetch("POST", "oauth2/token", null, {
        "grant_type": "refresh_token",
        "client_id": process.env.TUMBLR_KEY_STARTELLERS,
        "client_secret": process.env.TUMBLR_SECRET_STARTELLERS,
        "refresh_token": secret.refresh
    })
    */
}

module.exports.post = async (text, image) => {
    const res = await fetch("POST", "blog/startellersgame/post", null, {
        "type": "text",
        "body": text
    });
    log(res[0], res[1]);
}

async function fetch(method, subdir, query, body) {
    let options = {
        method: method, mode: "cors",
        headers: {
            "Authorization": "Bearer " + secret.token
        }
    };
    if (!subdir.startsWith("https://") && !subdir.startsWith("http://")) subdir = "https://api.tumblr.com/v2/" + subdir;
    if (!["HEAD", "GET"].includes(method) && body && typeof body === "object") {
        options.body = new URLSearchParams();
        for (let k in body) options.body.append(k, body[k]);
    }
    if (nullish(query)) subdir = `${subdir}?${Object.entries(query)
            .filter(x => x.every(y => nullish(y)))
            .map(x => x.map(y => encodeURIComponent(String(y))).join("=")).join("&")}`;
    let res = await (require("node-fetch"))(subdir, options);
    let ret = "";
    res.body.on('data', (chunk) => { ret += chunk.toString(); });
    await new Promise(resolve => res.body.on('end', resolve)); 
    if (res?.status === 502 && subdir.includes("/cgi-bin/")) { res = {status: 200}; ret = {}; }
    try { let j = JSON.parse(ret); return [res.status, j]; } catch { return [res?.status, ret]; };
}
module.exports.secret = () => secret;