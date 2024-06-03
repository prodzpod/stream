const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { measureStart, listFiles, measureEnd, path } = require('./common');
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
    info(`Apps Loaded, duration: ${measureEnd(mGlobal)}ms`);
    return res;
}
module.exports.apps = () => [app, app2];
module.exports.end = async () => {
    if (app) await app.destroy();
    if (app2) await app2.destroy();
}