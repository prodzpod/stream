const fs = require("fs");
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { measureStart, listFiles, measureEnd, path, SERVER_EMOTES, WASD, SERVER, CHANNEL_REACTIONROLE, MESSAGE_REACTIONROLE, CHANNEL_GENERAL, inPlaceSort } = require('./common');
const { info, log, verbose, warn, error } = require('./ws');
const OPTIONS = { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessageReactions], partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember] };
let app = undefined, app2 = undefined, commands = {};
module.exports.init = async () => {
    await module.exports.end();
    log("Loading Apps"); const mGlobal = measureStart();
    log("Loading Events"); const mEvents = measureStart();
    for (const fname of (await listFiles("src/discord/event")).filter(x => x.endsWith(".js")).map(x => x.slice(0, -".js".length)))
        commands[fname.split("/").at(-1)] = require(path("src/discord/event", fname)).execute ??
        (() => { warn("command", fname, "execute does not exist, skipping"); });
    log(`Loaded ${Object.keys(commands).length} events, duration: ${measureEnd(mEvents)}ms`);
    let ret = [];
    ret.push(new Promise(resolve => {
        app = new Client(OPTIONS);
        for (const fname of Object.keys(commands)) 
            app.on(fname, (...args) => {
                try { commands[fname]([app, app2], ...args) } catch (e) { error(fname, e.stack); }
            });
        app.on("ready", () => {
            log("Bot 1 Online!");
            resolve();
        });
        app.on("debug", x => verbose(x));
        app.on("warn", x => warn(x));
        app.on("error", x => error(x));
        app.login(process.env.DISCORD_TOKEN);
    }));
    ret.push(new Promise(resolve => {
        app2 = new Client({ intents: [] });
        app2.on("ready", () => {
            log("Bot 2 Online!");
            resolve();
        });
        app2.on("debug", x => verbose(x));
        app2.on("warn", x => warn(x));
        app2.on("error", x => error(x));
        app2.login(process.env.DISCORD_TOKEN_2);
    }));
    const res = await Promise.all(ret);
    emotes = WASD.unpack(fs.readFileSync("./emotes.wasd"))[0];
    log("emotes:", emotes);
    info(`Apps Loaded, duration: ${measureEnd(mGlobal)}ms`);
    server = await app.guilds.fetch(SERVER);
    generalChannel = await server.channels.fetch(CHANNEL_GENERAL);
    reactionRoleMessage = await (await server.channels.fetch(CHANNEL_REACTIONROLE)).messages.fetch(MESSAGE_REACTIONROLE);
    log("Contents Loaded:", server.name, generalChannel.name, reactionRoleMessage.content);
    return res;
}
let emotes = [];
module.exports.handleEmotes = async (text, es) => {
    if (es.length <= 0) return text;
    let manager = (await app.guilds.fetch(SERVER_EMOTES)).emojis;
    let urls = emotes.map(x => x.url);
    let idxs = es.map(x => urls.indexOf(x.url));
    for (let i = 0; i < idxs.length; i++) if (idxs[i] !== -1) es[i].id = emotes[idxs[i]].id;
    let ids = es.filter(x => x.id !== undefined).map(x => x.id);
    let newEmotes = es.filter(x => x.source !== "vanilla").map(x => ({name: x.name, url: x.url, id: x.id}));
    emotes = emotes.filter(x => !ids.includes(x.id));
    urls = emotes.map(x => x.url);
    for (let e of newEmotes) if (!urls.includes(e.url)) { emotes = [e, ...emotes]; urls.push(e.url); }
    for (let x of emotes.slice(50)) if (x.id !== undefined) { log("Deleting Old Emote", x.name); try { await manager.delete(x.id); } catch {} }
    emotes = emotes.slice(0, 50);
    for (let i = 0; i < emotes.length; i++) if (emotes[i].id === undefined) {
        log("Creating New Emote", emotes[i].name, `(${emotes[i].url})`);
        // try { emotes[i].id = (await manager.create({ attachment: emotes[i].url, name: emotes[i].name.trim().replace(/\W/g, "_").slice(0, 32).padStart(2, "_") }))?.id; } 
        // catch (e) { error(e); emotes[i].id = false; } 
        emotes[i].id = false;
        // emotes = emotes.map(x => { if (x.url === emotes[i].url && x !== emotes[i]) x.id = id; return x; }); 
    }
    for (let e of inPlaceSort(es, (a, b) => a.position - b.position).reverse()) {
        let emote = (e.source === "vanilla") ? e : emotes.find(x => x.url === e.url);
        if (emote === undefined) continue;
        let name = (emote.source === "vanilla") ? emote.name : emote.name.trim().replace(/\W/g, "_").slice(0, 32).padStart(2, "_");
        let txt;
        if (emote.source === "vanilla") txt = name;
        else if (!emote.id) txt = `:${name}:`;
        else txt = `<${emote.url.endsWith(".gif") ? "a" : ""}:${name}:${emote.id}>`;
        text = text.slice(0, e.position).padEnd(e.position, " ") + txt + text.slice(e.position);
    }
    fs.writeFileSync("./emotes.wasd", WASD.pack(emotes));
    return text;
}
module.exports.apps = () => [app, app2];
module.exports.end = async () => {
    if (app) await app.destroy();
    if (app2) await app2.destroy();
}

let server = null;
module.exports.server = () => server;
let reactionRoleMessage = null;
module.exports.reactionRoleMessage = () => reactionRoleMessage;
let generalChannel = null;
module.exports.generalChannel = () => generalChannel;

module.exports.addRole = (user, role) => {
    try {
        app.guilds.fetch(SERVER).then(guild => guild.members.fetch(user).then(member => member.roles.add(role)));
    } catch (e) { error(e); }
}
module.exports.removeRole = (user, role) => {
    try {
        app.guilds.fetch(SERVER).then(guild => guild.members.fetch(user).then(member => member.roles.remove(role)));
    } catch (e) { error(e); }
}