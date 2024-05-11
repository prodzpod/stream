const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { getIdentifier, WASD, isNullOrWhitespace } = require('../@main/util_client');
const { listFiles, saveFile } = require('../@main/util_server');
const { sendClient, data, writeData } = require('../@main/include');
const OPTIONS = { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessageReactions], partials: [Partials.Message, Partials.Channel, Partials.Reaction] };
module.exports.ID = 'discord';
module.exports.log = (...stuff) => console.log('[DISCORD]', ...stuff);
module.exports.warn = (...stuff) => console.warn('[DISCORD]', ...stuff);
module.exports.error = (...stuff) => console.error('[DISCORD]', ...stuff);
let app, app2, server, general, general2, announcements;
let lastUser = null, useApp2 = true;
let logins = {};
let users = {};
let irc = {};
let messages = {};
module.exports.attemptLogin = (str, user) => {
    str = str.trim();
    let k = Object.keys(logins).find(x => logins[x] == str);
    if (k) delete logins[k];
    users[k] = user;
    return k;
}
const THE_COMPUTER = "1117223939014410261";
module.exports.init = async () => {
    users = {};
    irc = {};
    messages = {};
    let _u = data().user;
    for (let k in _u) {
        if (_u[k].discord) users[_u[k].discord] = k;
        if (_u[k].irc) irc[_u[k].irc] = k;
    }
    if (app) await app.destroy();
    if (app2) await app2.destroy();
    return new Promise(async resolve => {
        app = new Client(OPTIONS);
        app.on('ready', async () => {
            this.log(`Logged in as ${app.user.tag}!`);
            server = await app.guilds.fetch('1219954701726912583');
            general = await server.channels.fetch('1219954701726912586');
            announcements = await server.channels.fetch('1219958741495975936');
            resolve(0);
        });
        listFiles(__dirname, 'events').then(events => {
            for (let event of events.map(x => x.slice(0, -'.js'.length))) {
                app.on(event, (...x) => require('./events/' + event).execute(app, ...x))
                this.log("Created discord event:", event);
            }
        });
        app.on('messageCreate', async message => {
            let __, user, content, reply = null;
            if (message.guildId != server) return;
            if (message.author.bot) switch (message.author.id) {
                case THE_COMPUTER:
                    [__, user, content] = message.content.match(/`<([^>]+)>` (.+)/);
                    user = irc[user] ?? ('#' + user);
                    break;
                default:
                    return;
            } else {
                user = this.fetchUser(message.author);
                content = message.cleanContent;
                reply = await message.channel.messages.fetch(message.reference);
                if (!user.startsWith("#") && new Date().getTime() - (data().user[user]?.discord_updated ?? 0) >= 24*60*60*1000) {
                    let avatar = message.member.avatarURL() ?? message.author.avatarURL();
                    if (avatar) {
                        let url = await saveFile(avatar + '?size=300', __dirname, `../@main/data/user/${user}.discord.png`);
                        if (url) writeData(`user.${user}`, { discord_image: url, discord_updated: new Date().getTime() });
                    }
                }
            }
            if (content.startsWith('!')) {
                if (user.startsWith('#') && !content.startsWith("!login")) {
                    message.reply('You are not logged in, please log in with `/login` first to connect your account to twitch.');
                    return;
                }
                messages[message.id] = message;
                sendClient('twitch', 'twitch', `${user}@id=${message.id};fromDiscord=true`, content);
                setTimeout(() => { delete messages[message.id]; }, 60000);
            } else if (message.channel === general) {
                sendClient(this.ID, 'twitch', '!discord', user, content + 
                    Array.from(message.attachments.values()).map(x => "\n" + x.url).join("") + 
                    Array.from(message.stickers.values()).map(x => "\n" + x.url).join("")); // convert images to urls
            }
        });
        app.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;
            switch (interaction.commandName) {
                case 'login':
                    let id = getIdentifier();
                    logins[interaction.user.id] = id;
                    interaction.reply({ content: `Send \`!login ${id}\` on the Twitch Chat to connect your account.`, ephemeral: true });
                    break;
                case 'reboottwitchbot':
                    sendClient(this.ID, 'twitch', 'restart');
                    interaction.reply('Reload Completed!');
                    break;
            }
        });
        app.on('error', er => this.log(er.stack));
        app.on('warn', er => this.log(er.stack));
        app.login(process.env.DISCORD_TOKEN);
        // prodzbot 2: no functionality, only double up sending and reacting
        app2 = new Client({ intents: [] });
        app2.on('ready', async () => {
            this.log(`Logged in as ${app2.user.tag}!`);
            general2 = await (await app2.guilds.fetch('1219954701726912583')).channels.fetch('1219954701726912586');
            resolve(0);
        });
        app2.on('error', er => this.log(er.stack));
        app2.on('warn', er => this.log(er.stack));
        app2.login(process.env.DISCORD_TOKEN_2);
    });
}
module.exports.fetchUser = user => users[user.id] ?? ('#' + user.tag);
module.exports.send = async (msg, user=null) => {
    if (!app) return;
    if (lastUser != user) { lastUser = user; useApp2 = !useApp2; }
    let channel = useApp2 ? general2 : general;
    if (isNullOrWhitespace(msg)) msg = '** **';
    if (user) msg = ('`<@' + user + '>`: ' + msg.replaceAll('@everyone', "**@**everyone").replaceAll('@here', "**@**here"));
    msg = msg.slice(0, 2000);
    channel.send(msg);
}
module.exports.reply = async (msg, id, user=null) => {
    if (!app) return;
    lastUser = user; useApp2 = !useApp2;
    let message = messages[id] ?? await general.messages.fetch(id);
    if (isNullOrWhitespace(msg)) msg = '** **';
    if (user) msg = ('`<@' + user + '>`: ' + msg.replaceAll('@everyone', "**@**everyone").replaceAll('@here', "**@**here"));
    msg = msg.slice(0, 2000);
    if (message) {
        messages[id].reply(msg);
        delete messages[id];
    } else {
        this.warn('Cannot find message id', id, 'to reply');
    }
}
module.exports.announce = (msg) => {
    if (!app) return;
    announcements.send(`@everyone\n${msg}\n\nhttps://prod.kr/live\nhttps://prod.kr/v/screen`);
}
module.exports.addIRC = (twitch, user) => { irc[user] = twitch; return 0; }
module.exports.commands = {}