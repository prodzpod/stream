const { nullish } = require("./common");

module.exports.init = async () => {

}

module.exports.post = async (text, image) => {
    await fetch("POST", "statuses", null, {
        status: text
    })
}

async function fetch(method, subdir, query, body) {
    let options = {
        method: method, mode: "cors",
        headers: {
            "Authorization": "Bearer " + process.env.MASTO_TOKEN
        }
    };
    if (!subdir.startsWith("https://") && !subdir.startsWith("http://")) subdir = "https://mastodon.gamedev.place/api/v1/" + subdir;
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