const { fetch } = require("../api");
const { STREAMER_ID } = require("../common");
const { log } = require("../ws");

module.exports.execute = async channel => {
    let ret = {};
    const res = await fetch("GET", "bits/cheermotes", {broadcaster_id: channel});
    if (res[0] !== 200) return [-1, res];
    for (let d of res[1].data) {
        ret[d.prefix] = {};
        for (let t of d.tiers) {
            let s = Object.values(t.images)[0] ?? {};
            let s2 = s.animated ?? s.static ?? {};
            let skey = Math.max(...Object.keys(s2).map(x => Number(x)));
            ret[d.prefix][t.id] = {url: s2[skey] ?? "", format: s.animated !== undefined ? "gif" : "png"};
        }
    }
    return [0, ret];
}