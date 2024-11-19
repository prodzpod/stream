const { nullish, WASD, path } = require("./common");
const { log } = require("./ws");
const fs = require("fs");
let secret;
module.exports.init = async () => {
    secret = WASD.unpack(fs.readFileSync(path("../secret/twitter_token.wasd")).toString())[0];
}

module.exports.post = async (text, image) => {
    const a = await fetch("POST", "tweets", null, {
        "text": text,
    });
    log(a[0], a[1]);
}

async function fetch(method, subdir, query, body, isEncoded = false) {
    let options = {
        method: method,
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + secret
        }
    };
    if (!subdir.startsWith("https://") && !subdir.startsWith("http://")) subdir = "https://api.x.com/2/" + subdir;
    if (!["HEAD", "GET"].includes(method) && body && typeof body === "object") options.body = JSON.stringify(body);
    if (nullish(query)) subdir = `${subdir}?${Object.entries(query)
            .filter(x => x.every(y => nullish(y)))
            .map(x => x.map(y => encodeURIComponent(String(y))).join("=")).join("&")}`;
    log(subdir, options);
    let res = await (require("node-fetch"))(subdir, options);
    let ret = "";
    res.body.on('data', (chunk) => { ret += chunk.toString(); });
    await new Promise(resolve => res.body.on('end', resolve)); 
    if (res?.status === 502 && subdir.includes("/cgi-bin/")) { res = {status: 200}; ret = {}; }
    try { let j = JSON.parse(ret); return [res.status, j]; } catch { return [res?.status, ret]; };
}