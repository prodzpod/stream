const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const expressWS = require('express-ws');
const bodyParser = require('body-parser');
const { takeWord, superstringify, delay, remove, WASD, unentry } = require('../@main/util_client');
const { listFiles, fileExists } = require('../@main/util_server');
const { sockets, log, warn, error } = require('./include');
let serverHTTP, serverHTTPS, clientFunctions;
let previous_auth = '';
let busy = [];
module.exports.init = async (extern) => {
    log('Web Module Loaded');
    await require('./api_server/reload_client').execute();
    if (serverHTTP?.listening) { log('Terminating Previous Server Instance'); await serverHTTP.close(); await serverHTTPS.close(); }
    // open server
    let app = express();
    serverHTTP = http.createServer(app);
    serverHTTPS = https.createServer({
        key: fs.readFileSync(process.env.HTTPS_KEY),
        cert: fs.readFileSync(process.env.HTTPS_CERT),
    }, app);
    expressWS(app, serverHTTP); expressWS(app, serverHTTPS);
    // z    
    if (extern?.web) for (let subpage in extern.web) {
        let url = extern.web[subpage].url; let subapp = extern.web[subpage].app;
        log('Mounting', url, 'as', subpage);
        app.use((req, res, next) => { if (url.includes(req.hostname)) subapp.handle(req, res, next); else next(); });
    }
    clientFunctions = Object.entries(require('../@main/util_client')).map(x => {
        if (x[0] === 'Math') // custom handling for Math extensions
            return Object.entries(x[1]).map(kv => `Math.${kv[0]} = ${(kv[1] + '').replace(/this\./g, "Math.")};`).join('\n');
        else if (x[0] === 'String') // custom handling for String prototype extensions
            return Object.entries(x[1]).map(kv => `String.prototype.${kv[0]} = ${(kv[1] + '').replace(/\(_this(?:,)?/, '(').replace(/_this/g, 'this')};`).join('\n');
        else if (typeof x[1] === 'object') // custom function objects: superstringify this
            return `var ${x[0]} = ${superstringify(x[1]).replace(/this\./g, `${x[0]}.`)};`;
        else if (typeof x[1] === 'string') return `var ${x[0]} = \`${x[1]}\``
        else return `var ${x[0]} = ${(x[1] + '').replace(/this\./g, '')};`; // variables and functions
    }).join('\n');
    app.set('view engine', 'pug');
    app.use(bodyParser.json())
    app.set('views', path.join(__dirname, 'views'));
    app.use('/', express.static(path.join(__dirname, 'public')));
    // views
    log('Adding Index Page');
    app.get('/', (req, res) => render('index', req, res));
    let files;
    files = await listFiles(__dirname, 'views');
    files.filter(x => x.endsWith('.pug') && x !== 'index.pug').map(x => {
        log('Adding View', x); x = x.slice(0, -4);
        app.get('/' + x, (req, res) => render(x, req, res));
    });
    // api (clientside)
    for (let x of ['DELETE', 'GET', 'PATCH', 'POST', 'PUT']) {
        files = await listFiles(__dirname, 'api_client', x)
        files.map(vr => {
            if (vr.endsWith('.js')) vr = vr.slice(0, -('.js'.length));
            v = vr;
            if (v === 'index') v = ''; else v = '/' + v;
            log('Registering api method', x, 'subpage', '/api/' + vr, `(/api${v})`);
            app[x.toLowerCase()]('/api' + v, (req, res) => {
                res.type('json');
                require(`./api_client/${x}/${vr}`).execute(req.query ?? {}, req.body ?? {}).then(raw => {
                    let [status, ret] = raw;
                    res.set({ 'Access-Control-Allow-Origin': '*' });
                    res.status(status).send(ret);
                });
            });
        });
    }
    files = await listFiles(__dirname, 'api_client', 'WS');
    files.map(subpager => {
        if (subpager.endsWith('.js')) subpager = subpager.slice(0, -('.js'.length));
        subpage = subpager;
        if (subpage.startsWith('index')) subpage = '/'; else subpage = '/' + subpage;
        log('Registering api method WS subpage', subpage, `(${subpage})`);
        app.ws(subpage, (ws, req) => {
            let api = require(`./api_client/WS${subpage}`);
            log('WebSocket Connected');
            ws.on('open', _ => ws.send(`register ${sockets.length}`));
            sockets.push(ws);
            if (api._init) {
                api._init(ws, req.query ?? {}, req.body ?? {}).then(ret => { if (ret !== undefined) ws.send(ret); });
            }
            ws.on('message', msg => {
                if (busy.includes(ws)) {
                    ws.send(WASD.pack("respond", "too many requests"));
                    return;
                }
                [k, v] = takeWord(msg);
                if (k.startsWith("_")) ws.send(WASD.pack("respond", "no"));
                if (api[k]) {
                    busy.push(ws);
                    api[k](ws, WASD.unpack(v)).then(ret => {
                        if (ret !== undefined) ws.send(ret);
                        busy = remove(busy, ws);
                    });
                }
                else if (api._all) {
                    busy.push(ws);
                    api._all(ws, k, WASD.unpack(v)).then(ret => {
                        if (ret === false) ws.send(WASD.pack("respond", "invalid method"));
                        else if (ret !== undefined) ws.send(ret);
                        busy = remove(busy, ws);
                    });
                }
                else {
                    warn(`Webclient WS hook ${k} does not exist, skipping`);
                    ws.send(WASD.pack("respond", "invalid method"));
                }
            });
        });
    });
    // api (serverside)
    require('./ws.js').init();
    // error pages
    app.get('*', (req, res) => {
        res.status(404);
        render('404', req, res);
    });
    app.use((err, req, res, __) => {
        res.status(err.status || 500);
        render('500', req, res);
        error(err.stack);
    });
    // listen
    serverHTTP.listen(80); serverHTTPS.listen(443);
    log('Website Online!');
    let auth = '';
    try {
        auth = JSON.parse(fs.readFileSync(AUTH_FNAME))?.token;
        if (!auth) throw 'make new auth';
    } catch { // no auth?!
        log('Reauthentication Needed, opening webpage...');
        import('open').then(open => { open.default('https://prod.kr/v/oauth') });
        while (!fileExists(AUTH_FNAME)) await delay();
        auth = JSON.parse(fs.readFileSync(AUTH_FNAME))?.token;
    } 
    if (auth !== previous_auth) {
        await require('../twitch/include.js').init(auth);
        await require('../twitch/main.js').init(auth);
        previous_auth = auth;
    }
    return 0;
}
const AUTH_FNAME = path.join(__dirname, '../../../secret/stream_session.json');
module.exports.cmpAuth = async (force = false) => {
    let auth = '';
    try {auth = JSON.parse(fs.readFileSync(AUTH_FNAME))?.token;}
    catch {}
    if (force || auth != previous_auth) {
        try {fs.rmSync(AUTH_FNAME)} catch {}
        import('open').then(open => { open.default('https://prod.kr/v/oauth') });
        while (!fileExists(__dirname, '../../../secret/stream_session.json')) await delay();
        auth = JSON.parse(fs.readFileSync(AUTH_FNAME))?.token;
    }
    return auth;
}

function render(page, req, res) {
    res.set({ 'Content-Type': 'text/html; charset=UTF-8', 'Access-Control-Allow-Origin': '*' });
    let params = { client: clientFunctions };
    let base = req.originalUrl.slice(0, req.originalUrl.indexOf("?")).split("/");
    for (let i = 0; i < base.length; i++) params['path_' + i] = base[i];
    for (let k of req.originalUrl.slice(req.originalUrl.indexOf("?") + 1).split("&").map(x => x.split("="))) params['query_' + k[0]] = k[1];
    // log(params);
    try { let data = require(path.join(__dirname, 'api_client/RENDER', page)).execute(req, res); Object.assign(params, data); } catch {}
    res.render(page, params);
    return 0;
}