const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const expressWS = require("express-ws");
const bodyParser = require("body-parser");
const { log, info, error, debug } = require("./ws");
const { fileExists, path, listFiles, WASD, split, unentry, nullish } = require("./common");

// TODO: rewrite this to fit gizmo2 (currently copied from gizmo1)
let serverHTTP, serverHTTPS, clientFunctions;
module.exports.init = async () => {
    clientFunctions = Object.entries(require(path("src/@main/common"))).map(x => {
        if (x[0] === "Math")
            return Object.entries(x[1]).map(kv => `Math.${kv[0]} = ${(kv[1] + '').replace(/module\.exports\.Math\./g, "Math.")};`).join('\n');
        else if (x[0] === "String") // custom handling for String prototype extensions
            return Object.entries(x[1]).map(kv => `String.prototype.${kv[0]} = ${(kv[1] + "").replace(/\(_this(?:,)?/, "(").replace(/_this/g, "this")};`).join("\n");
        else if (typeof x[1] === "object") // custom function objects: superstringify this
            return `var ${x[0]} = ${superstringify(x[1]).replaceAll("module.exports.", "")};`;
        else if (typeof x[1] === "string") return `var ${x[0]} = \`${x[1]}\``
        else return `var ${x[0]} = ${(x[1] + "").replaceAll("module.exports.", "")};`; // variables and functions
    }).join('\n');
    await module.exports.end();
    // init
    const app = express();
    serverHTTP = http.createServer(app);
    serverHTTPS = https.createServer({
        key: fs.readFileSync(process.env.HTTPS_KEY),
        cert: fs.readFileSync(process.env.HTTPS_CERT),
    }, app);
    expressWS(app, serverHTTP, { wsOptions: { maxPayload: 8192 } }); expressWS(app, serverHTTPS, { wsOptions: { maxPayload: 8192 } });
    if (fileExists("external", "init.js")) {
        const extern = await require(path("external", "init.js")).init();
        for (const subpage in extern.web) {
            const url = extern.web[subpage].url, subapp = extern.web[subpage].app;
            log("Mounting", url, "as", subpage);
            app.use((req, res, next) => { if (url.includes(req.hostname)) subapp.handle(req, res, next); else next(); });
        }
    }
    app.set("view engine", "pug");
    app.use(bodyParser.json());
    app.set("views", path("src/web/views"));
    app.use("/", express.static(path("src/web/public")));
    log("Adding Index Page");
    app.get("/", (req, res) => render("index", req, res));
    // views
    let files;
    files = await listFiles("src/web/views");
    files.filter(x => x.endsWith(".pug") && x !== "index.pug").map(x => {
        log("Adding View", x); x = x.slice(0, -4);
        app.get("/" + x, (req, res) => render(x, req, res));
    });
    // api (clientside)
    for (let x of ["DELETE", "GET", "PATCH", "POST", "PUT"]) {
        files = await listFiles("src/web/api", x)
        files.map(vr => {
            if (vr.endsWith(".js")) vr = vr.slice(0, -(".js".length));
            v = vr;
            if (v === "index") v = ""; else v = "/" + v;
            log("Registering api method", x, "subpage", "/api/" + vr, `(/api${v})`);
            app[x.toLowerCase()]("/api" + v, (req, res) => {
                require(`./api/${x}/${vr}`).execute(req.query ?? {}, req.body ?? {}).then(raw => {
                    let status = raw[0], ret = raw[1], type = raw[2] ?? "json";
                    res.type(type);
                    res.set({ "Access-Control-Allow-Origin": "*" });
                    res.status(status).send(ret);
                });
            });
        });
    }
    files = await listFiles("src/web/api", "WS");
    files.map(subpager => {
        if (subpager.endsWith(".js")) subpager = subpager.slice(0, -(".js".length));
        let subpage = subpager;
        if (subpage.startsWith("index")) subpage = "/"; else subpage = "/" + subpage;
        log("Registering api method WS subpage", subpage, `(${subpage})`);
        app.ws(subpage, (ws, req) => {
            const api = require(`./api/WS${subpage}`);
            log("WebSocket Connected");
            if (api._init) {
                let res = api._init(ws, req.query ?? {}, req.body ?? {});
                if (res instanceof Promise) res.then(ret => { if (nullish(ret)) ws.send(WASD.pack("register", ret)); });
                else if (nullish(res)) ws.send(WASD.pack("register", res));
            }
            ws.on("message", async msg => {
                let [id, k, v] = split(msg, /\s+/, 2); v = WASD.unpack(v);
                if (k.startsWith("_")) ws.send(WASD.pack("respond", id, "no"));
                let res = null;
                if (api[k]) { res = api[k](ws, v); if (res instanceof Promise) res = await res; }
                if (api._all) { res = api._all(ws, [k, ...v], nullish(res)); if (res instanceof Promise) res = await res; }
                if (nullish(res) === null) ws.send(WASD.pack("respond", id, "invalid method"));
                else ws.send(WASD.pack("respond", id, res));
            });
        });
    });
    // error pages
    app.get("*", (req, res) => {
        res.status(404);
        render("404", req, res);
    });
    app.use((err, req, res, __) => {
        if (err.stack.startsWith("URIError") && err.stack.includes("cgi-bin")) { res.status(400); log("they're doing it again"); res.send("stop bro ur not getting this"); return; }
        const status = err.status || 500;
        res.status(status);
        if (status >= 500) {
            render("500", req, res);    
            error(err.stack);
        } else render("400", req, res);
    });
    // listen
    serverHTTP.listen(80); serverHTTPS.listen(443);
    info("Website Online!");
}

function render(page, req, res) {
    res.set({ "Content-Type": "text/html; charset=UTF-8", "Access-Control-Allow-Origin": "*" });
    let params = { client: clientFunctions };
    let base = req.originalUrl.slice(0, req.originalUrl.indexOf("?")).split("/");
    for (let i = 0; i < base.length; i++) params["path_" + i] = base[i];
    for (let k of req.originalUrl.slice(req.originalUrl.indexOf("?") + 1).split("&").map(x => x.split("="))) params["query_" + k[0]] = k[1];
    // log(params);
    try { let data = require("src/web/api/RENDER", page).execute(req, res); Object.assign(params, data); } catch {}
    res.render(page, params);
    return 0;
}

function superstringify(o) {
    //! DO NOT USE THIS ON USER INPUT !! its basically eval lol
    if (typeof o !== 'object') return o + '';
    let funcs = [], ret;
    if (Array.isArray(o)) ret = JSON.stringify(o.map(x => { if (isFunction(x)) { funcs.push(x + ''); return `%%%REPLACEME-${funcs.length - 1}%%%`; } return x; }));
    else ret = JSON.stringify(unentry(Object.entries(o).map(kv => { if (isFunction(kv[1])) { funcs.push(kv[1] + ''); return [kv[0], `%%%REPLACEME-${funcs.length - 1}%%%`]; } return kv; })));
    for (let i = 0; i < funcs.length; i++) ret = ret.replace(`"%%%REPLACEME-${i}%%%"`, funcs[i]);
    return ret;
}

function isFunction(o) {
    //! DO NOT USE THIS ON USER INPUT !! its basically eval lol
    try {
        if ((new Function(`return ${o}`))() instanceof Function) return true;
        return false; } catch { return false; }
}

module.exports.end = async () => {
    if (serverHTTP?.listening) { log("Terminating Previous Server Instance"); await serverHTTP.close(); await serverHTTPS.close(); }
}