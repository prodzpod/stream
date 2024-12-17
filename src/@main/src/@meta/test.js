const { src, send, data } = require("../..");
const { WASD, array, randomHex, nullish, random, realtype, Math } = require("../../common");
const { log, path, fetch } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!test";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    // https://twitter.com/i/oauth2/authorize?response_type=code&client_id=M3JlOUVSbnc0TFg1RFR3UXEzUDI6MTpjaQ&redirect_uri=https://prod.kr/oauth&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain
    /*
    log(WASD.pack(await fetch({})("POST", "https://api.x.com/2/oauth2/token", null, {
        code: args(text)[0],
        grant_type: "authorization_code",
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: "https://prod.kr/oauth",
        code_verifier: "challenge"
    }, "application/x-www-form-urlencoded")));
    */
    // https://www.tumblr.com/oauth2/authorize?client_id=96zrrgRT0LlFGdvKjls9zSxDlPzKtnZfaDH1nVVpca53t5wQL7&response_type=code&scope=basic%20write%20offline_access&state=state
    /*
    log(WASD.pack(await fetch({})("POST", "https://api.tumblr.com/v2/oauth2/token", null, {
        code: args(text)[0],
        grant_type: "authorization_code",
        client_id: process.env.TUMBLR_KEY_STARTELLERS,
        client_secret: process.env.TUMBLR_SECRET_STARTELLERS
    }, "application/x-www-form-urlencoded")));
    */
    return await new Promise(resolve => {
        ti = setInterval(async () => {    
            msgs = [];
            if (!DATA[i]) { _reply("done"); clearInterval(ti); resolve([0, ""]); return; }
            msgs.push(await sendGizmo(DATA[i][0], "<size=0>"));
            if (realtype(DATA[i][1]) === "array") {
                for (let a of DATA[i][1]) msgs.push(await sendGizmo(a, "<size=0>"));
            }
            else msgs.push(await sendGizmo(DATA[i][2], DATA[i][1]));
            if (msgs.length) {
                const x = msgs[0][0] + 300; const ys = msgs.map(y => (610 - y[1]) * 2);
                if (Number.isNaN(x)) resolve([0, ""]);
                for (let j = 0; j < ys.length; j++) setTimeout(() => {
                    const y = 610 - Math.sum(ys.slice(j + 1)) - (ys[j] / 2);
                    send("gizmo", "close", ".", "#ffffff", x, y, "pointer/cursor"); return [0, ""];
                }, 978.021978021978 + (1000 / msgs.length * j));
            }
            i++;
            return;
        }, 1978.021978021978);
    });
}
let ti;
let msgs = [];

const DATA = [
    ["Hypertext Bestiary -1", "OH MY GOSH PROD HELL YEAH", "modclonk"], 
    ["Between the Wires -1", "GGG (gravity is good)", "eudemoniac"], 
    ["Hypertext Bestiary 0", "I once slammed my balls on the ground, R.I.P Pangea", "imgeiser"], 
    ["Between the Wires 0", "no signal is real???", "exodrifter_"], 
    ["Hypertext Bestiary 1", "windows came back", "tlatitude"], 
    ["Between the Wires 1", "I have killed everyone", "sudohaxe"], 
    ["Hypertext Bestiary 2", "hello geiser's mom", "ctrl_o"], 
    ["Between the Wires 2", "<::O:1270664307981553674>twitch is done for", "xorxavier"], 
    ["Hypertext Bestiary 3", "I have unlimited power now", "nulligor"], 
    ["Betweeen the Wires 3", "is anything REAL?", "static_anachromatic"], 
    ["Hypertext Bestiary 4", "Nossex? The missing London borough?", "liquidcake1"], 
    ["Betweeen the Wires 4", "im actually unironically back", "nulligor"], 
    ["Hypertext Bestiary 5", "i love income", "badcop_"], 
    ["Betweeen the Wires 5", "you'd have to throw to lose", "asquared31415"], 
    ["Hypertext Bestiary 6", "i'm John Furryfluid", "machka6"], 
    ["I was on here :3", ["jakecreatesstuff"]], 
    ["Betweeen the Wires 6", "WHICH one of you is doing this", "zynthesizey"], 
    ["Hypertext Bestiary 7", "lain episode aired on 9/11", "ctrl_o"], 
    ["Betweeen the Wires 7", "i cant wait to marry floating guy with guns", "ellg"], 
    ["CoreZONE Participants", ["ctrl_o", "asquared31415", "nichepenguin", "tyumici", "lcolonq", "ricardo_stryki", "xorxavier"]], 
    ["Hypertext Bestiary 8", "you need a monkey", "xorxavier"], 
    ["Betweeen the Wires 8", "There's already drug mods", "yiffweed"], 
    ["Hypertext Bestiary 9", "play despacito it may fix it", "machiavellianalloy"], 
    ["Betweeen the Wires 9", "it says your mother is a hamster", "danktownbunny"], 
    ["Hypertext Bestiary 10", "TIME IS RUNNING OUT", "xorxavier"], 
    ["Betweeen the Wires 10", "quick someone reboot prod", "xorxavier"], 
    ["Hypertext Bestiary 11", "adobe products are on steam?!?!?!<?", "xorxavier"], 
    ["Betweeen the Wires 11", "!exec 2n ** 1000000n", "ricardo_stryki"], 
    ["Hypertext Bestiary 12", "(male, (male, nil))", "asquared31415"], 
    ["Between the Wires 12", "you can make curry or currying while programming", "ricardo_stryki"], 
    ["Hypertext Bestiary 13", "non... sincerely... GET OUT!!!!!!!!!!!!!!!!!!", "machka6"], 
    ["prod zed pod SPECIAL session", "you were a gamer before vstyle", "ctrl_o"], 
    ["Between the Wires 13", "THIS IS OPERA GX????", "exodrifter_"], 
    ["Hypertext Bestiary 14", "JavaScript is scary and malicious", "ricardo_stryki"], 
    ["Between the Wires 14", "free guys?", "raginggoblinr"], 
    ["Hypertext Bestiary 15", "THE JOKER has only 1.5% jokerness??", "nichepenguin"], 
    ["Between the Wires 15", "i am a lowercase no punctuation", "xorxavier"], 
    ["Hypertext Bestiary 16", "THE MOSHER vs THE JOKER??", "nichepenguin"], 
    ["Between the Wires 16", "sus1d1p observation duty", "xorxavier"], 
    ["Hypertext Bestiary 17", "fixed twerking? debuff", "jakecreatesstuff"], 
    ["Between the Wires 17", "Im in your basement", "joseththefrogie"], 
    ["Hypertext Bestiary 18", "Witscord The Game 2025", "machka6"], 
    ["prod zed pod AFTER DARK 2", "hi: working on portfolio thing (chill)", "prodzpod"], 
    ["Between the Wires 18", "bandwidth reduction through bureaucracy", "nichepenguin"], 
    ["Hypertext Bestiary 19", "uuuueh my beejoe....", "BrighterMalphon"], 
    ["Between the Wires 19", "oh this week is going to be wild", "mickynoon"], 
    ["Hypertext Bestiary 20", []], 
];
let i = 0;

async function sendGizmo(chatterName, text) {
    let icon = [];
    let id = getID(chatterName);
    let color = "#000000";
    if (id) {
        const chatter = data().user[id]
        icon.push("icon/" + chatter.economy.icon.icon);
        chatterName = chatter.twitch.name
        color = chatter.twitch?.color ?? "#000000";
    } else icon.push("icon/common/" + random(data().icon.common));
    return await send("gizmo", "chat", "ALWAYS_ON_ID", icon, color, chatterName, WASD.toString(text), 0);
}
const getID = (name) => Object.values(data().user).find(x => x.twitch?.login.toLowerCase() === name.toLowerCase())?.twitch.id;