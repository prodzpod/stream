const { WASD, Math, nullish, split } = require("../@main/common"); //! REWRITE INTO DIFFERENT LANGUAGE ON REMAKE
const { listFiles, path, measureStart, measureEnd, open } = require("../@main/commonServer");
module.exports.WASD = WASD;
module.exports.listFiles = listFiles;
module.exports.path = path;
module.exports.measureStart = measureStart;
module.exports.measureEnd = x => Math.prec(measureEnd(x));
module.exports.nullish = nullish;
module.exports.open = open;
module.exports.split = split;

module.exports.fetch = (header) => async (method, subdir, query, body, form = "application/json") => {
    let options = {
        method: method, mode: "cors",
        headers: header
    };
    if (form === "multipart/form-data") form = body.getHeaders()["content-type"];
    options.headers["Content-Type"] = form;
    options.headers["content-type"] = form;
    options.headers["contentType"] = form;
    if (!subdir.startsWith("https://") && !subdir.startsWith("http://")) subdir = "https://" + subdir;
    if (!["HEAD", "GET"].includes(method) && body) {
        switch (form) {
            case "application/json": options.body = JSON.stringify(body); break;
            case "application/x-www-form-urlencoded": options.body = Object.entries(body).filter(x => x.every(y => nullish(y))).map(x => x.map(y => encodeURIComponent(String(y))).join("=")).join("&"); break;
            default: options.body = body; break;
        }
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