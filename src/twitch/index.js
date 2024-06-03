const fs = require("fs");
const { WASD, path, measureStart, measureEnd } = require("./common"); 
const { init, close, error, info } = require("./ws");
const { setSecret, validate } = require("./api");

try {(async () => {

console.log("Loading Twitch Module"); const mGlobal = measureStart();
await init();
try { setSecret(WASD.unpack(fs.readFileSync(path("../secret/twitch_token.wasd")).toString())); }
catch (e) { error("twitch_token.wasd is invalid! please refresh and restart twitchbot."); close(); return; }
const test = await validate();
if (test === 1) await require("./eventsub").init();
info(`Twitch Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }
