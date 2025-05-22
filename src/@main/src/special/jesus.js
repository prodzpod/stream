const { send, src } = require("../..");
const { delay, random, remove } = require("../../common");
const { log } = require("../../commonServer");

let forceEnd = false;
const TEXTS = [
    "Sponsored by\n@SaladForrest",
    "Sponsored by\n@RatCousin",
    "Sponsored by\n@NilbogLive",
    "Sponsored by\n@BugVT",
    "!buy",
    "!wallet",
    "!stocks",
    "!invest",
    "HORSE\nELECTROLYTES",
    "hop on\nvoid stranger",
    "hop on\nblue prince",
    "hop on\nlinelith",
];
const EVENTS = [
    async () => { // logo change
        await op0("jesus::joel");
        await op1("jesus::twitch");
        await delay(30000);
        await op1("jesus::joel");
        await op0("jesus::twitch");
        await delay(30000);
        return true;
    },
    async () => { // text change
        if (isIntermission) {
            await module.exports.changeText("be right back", "be right back", "be right back");
            await delay(15000);
        }
        let _t = [...TEXTS];
        const l = random(_t); _t = remove(_t, l);
        const m = random(_t); _t = remove(_t, m);
        const r = random(_t); 
        await module.exports.changeText(l, m, r);
        await delay(15000);
        return true;
    },
    async () => { // camera change
        const amp = random(random(random(random(200))));
        const cx = -369.5; const cy = -201;
        await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::stage", filterName: "Move Camera", filterSettings: {pos: {x: random(cx - amp, cx + amp), y: random(cy - amp, cy + amp)}}});
        await delay(20);
        await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::stage", filterName: "Move Camera", filterEnabled: true});
        await delay(2000);
        return true;
    }
];
module.exports.start = async () => {
    for (const event of EVENTS) {
        let e = async () => {
            if (forceEnd) return;
            await event();
            e();  
        };
        e();
    }
}
module.exports.end = () => forceEnd = true;

module.exports.changeText = async (left, center, right) => {
    await op0("jesus::textleft"); await op0("jesus::textcenter"); await op0("jesus::textright");
    await delay(1000);
    await send("obs", "send", "SetInputSettings", {inputName: "jesus::textleft", inputSettings: {text: left}});
    await send("obs", "send", "SetInputSettings", {inputName: "jesus::textcenter", inputSettings: {text: center}});
    await send("obs", "send", "SetInputSettings", {inputName: "jesus::textright", inputSettings: {text: right}});
    await op1("jesus::textleft"); await op1("jesus::textcenter"); await op1("jesus::textright");
    await delay(1000);
    return true;
}

module.exports.mainscreen = async (title) => { // https://oganm.com/api/t2i?t=arbitrary%20text
    switch (title) {
        case "forrest":
            await op0("jesus::screen");
            await op1("jesus::forrest");
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume", filterSettings: {setting_float: 0}});
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume 2", filterSettings: {setting_float: 0}});
            await delay(20);
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume", filterEnabled: true});
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume 2", filterEnabled: true});
            break;
        case "jesus":
            await op1("jesus::screen");
            await op0("jesus::forrest");
            await send("web", "switchscreen", "jesus");
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume", filterSettings: {setting_float: -30}});
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume 2", filterSettings: {setting_float: -30}});
            await delay(20);
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume", filterEnabled: true});
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume 2", filterEnabled: true});
            break;
        case "judas":
            await op1("jesus::screen");
            await op0("jesus::forrest");
            await send("web", "switchscreen", "judas");
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume", filterSettings: {setting_float: -30}});
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume 2", filterSettings: {setting_float: -30}});
            await delay(20);
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume", filterEnabled: true});
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume 2", filterEnabled: true});
            break;
        default:
            await op1("jesus::screen");
            await op0("jesus::forrest");
            await send("web", "switchscreen", "static", title);
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume", filterSettings: {setting_float: -30}});
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume 2", filterSettings: {setting_float: -30}});
            await delay(20);
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume", filterEnabled: true});
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume 2", filterEnabled: true});
            break;
    }
}

let isIntermission = false;
module.exports.intermission = async (op) => {
    await op1("jesus::screen");
    await opacity("jesus::forrest", op ? 1 : 0);
    await send("obs", "send", "SetCurrentProgramScene", {sceneName: op ? "jesus::intermission" : "jesus::stage_wrapper"});
    if (op) {        
        await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume", filterSettings: {setting_float: 0}});
        await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume 2", filterSettings: {setting_float: 0}});
        await delay(20);
        await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume", filterEnabled: true});
        await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume 2", filterEnabled: true});
    } else {        
        await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume", filterSettings: {setting_float: -30}});
        await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::forrest", filterName: "Volume 2", filterSettings: {setting_float: -30}});
        await delay(20);
        await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume", filterEnabled: true});
        await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::forrest", filterName: "Volume 2", filterEnabled: true});
    }
    await delay(1000);
    isIntermission = !!op;
    return true;
}
let isHeadlineOut = true;
module.exports.headline = async (string) => {
    if (!isWatermarkOut && string) { await module.exports.watermark(true); await delay(20); }
    if (isHeadlineOut && string) { await headlineToggle(false); await delay(20); }
    if (string) await send("obs", "send", "SetInputSettings", {inputName: "jesus::title", inputSettings: {text: string}});
    await headlineToggle(!!string);
    return true;
}
async function headlineToggle(op) {
    await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::stage", filterName: "Move Headline", filterSettings: {pos: {x: 254, y: op ? 628 : 828}}});
    await delay(20);
    await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::stage", filterName: "Move Headline", filterEnabled: true});
    await delay(300);
    isHeadlineOut = op;
    return true;
}
let isWatermarkOut = true;
module.exports.watermark = async (op) => {
    if (!op && isHeadlineOut) { await headlineToggle(false); await delay(20); }
    if (!op) await send("obs", "send", "SetSceneItemEnabled", "jesus::stage", "jesus::headline", {"sceneItemEnabled": false});
    await opacity("jesus::watermark", op ? 1 : 0);
    await delay(1000);
    if (op) await send("obs", "send", "SetSceneItemEnabled", "jesus::stage", "jesus::headline", {"sceneItemEnabled": true});
    isWatermarkOut = !!op;
    return true;
}

module.exports.veadotube = async (direction) => {
    await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "collab", filterName: "Move " + direction, filterEnabled: true});
}

async function opacity(source, op) {
    await send("obs", "send", "SetSourceFilterSettings", {sourceName: source, filterName: "Move Value", filterSettings: {setting_float: op}});
    await delay(20);
    await send("obs", "send", "SetSourceFilterEnabled", {sourceName: source, filterName: "Move Value", filterEnabled: true});
    return true;
}
async function op0(source) { return await opacity(source, 0); }
async function op1(source) { return await opacity(source, 1); }

module.exports.button = async (key) => {
    if (key.endsWith("sfx")) send("gizmo", "playsound", "jesusislit/" + key.slice(0, -" sfx".length));
    else switch (key) {
        case "intermission on":
            await module.exports.intermission(true);
            break;
        case "intermission off":
            await module.exports.intermission(false);
            await send("gizmo", "playsound", "jesusislit/applause");
            break;
        case "close headline":
            await module.exports.headline(false);
            break;
        case "watermark on":
            await module.exports.watermark(true);
            break;
        case "watermark off":
            await module.exports.watermark(false);
            break;
        case "headline off":
            await module.exports.headline(null);
            break;
        case "ending":
            await send("gizmo", "playsound", "forrest/tts8");
            await send("obs", "send", "SetSceneItemEnabled", "jesus::intermission", "streaming_audio (not)", {"sceneItemEnabled": false});
            await op1("jesus::news1");
            break;
        case "ending2":
            await op1("jesus::news1");
            break;
        default:
            if (key.startsWith("headline:")) await module.exports.headline(key.slice("headline: ".length));
            else if (key.startsWith("screen:")) await module.exports.mainscreen(key.slice("screen: ".length));
            else if (key.startsWith("jesusprice:")) await src().coin.set(109830946, ...key.slice("jesusprice: ".length).split(" ").map(x => Number(x)));
            else if (key.startsWith("judasprice:")) await src().coin.set(1028054302, ...key.slice("judasprice: ".length).split(" ").map(x => Number(x)));
            break;
    }
    return [0, ""];
}