const fetch = require("node-fetch");
const { measureStart, measureEnd } = require("./common"); 
const { init, info, error, log, send } = require("./ws");

try {(async () => {

console.log("Global Consciousness Project Module"); const mGlobal = measureStart();
await init();
gcp(); gcp2();
info(`Global Consciousness Project Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }

async function gcp() {
    const html = await fetch("https://global-mind.org/gcpdot/gcpindex.php?current=1&nonce=238930");
    if (html.status !== 200) { error("gcp fetch error:", html.status, html.error); process.exit(1); }
    send("gcp", Number((await html.text()).match(/([\d\.]+)<\/s><\/ss>/)[1]));
    setTimeout(gcp, 60000);
}

async function gcp2() {
    const gcp2Token = await fetch("https://gcp2.net/js/data/api_token.js?2.0.2")
    if (gcp2Token.status === 200) {
        const token = (await gcp2Token.text()).match(/(Bearer \d+\|\w+)/)[1];
        const html = await fetch("https://gcp2.net/api/getcurrentnetvar", { headers: { Authorization: token }});
        if (html.status === 200) send("gcp2", Number((await html.json()).netvar[0].netvar) / 250);
    }
    setTimeout(gcp2, 60000);
}