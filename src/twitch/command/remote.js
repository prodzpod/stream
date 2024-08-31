const { fetch, secret } = require("../api");
const { BOT_ID } = require("../common");
const { log } = require("../ws");

module.exports.execute = async (method, subdir = "", query, body, isEncoded = false) => {
    let metaq = {};
    for (let k in query) metaq["query_" + k] = query[k];
    metaq.action = "faketwitch";
    metaq.secret = process.env.PUBNIX_SECRET;
    metaq.method = method;
    metaq.subdir = subdir;
    metaq["header_Authorization"] = "Bearer " + secret().token;
    metaq["header_Client-Id"] = BOT_ID;
    metaq["header_Content-Type"] = isEncoded ? "application/x-www-form-urlencoded" : "application/json";
    if (body) metaq.body = JSON.stringify(body);
    const res = await fetch("GET", "https://pub.colonq.computer/~prod/cgi-bin/api.cgi", metaq, {}, isEncoded);
    if (res[0] !== 200) return [-1, res];
    else return [0, res[1]];
}