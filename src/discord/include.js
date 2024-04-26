const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { getIdentifier, WASD } = require('../@main/util_client');
const { listFiles } = require('../@main/util_server');
const { sendClient, data } = require('../@main/include');
const OPTIONS = { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent], partials: [Partials.Message, Partials.Channel, Partials.Reaction] };
module.exports.ID = 'discord';
module.exports.log = (...stuff) => console.log('[DISCORD]', ...stuff);
module.exports.warn = (...stuff) => console.warn('[DISCORD]', ...stuff);
module.exports.error = (...stuff) => console.error('[DISCORD]', ...stuff);
let app, server, general, announcements;
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
    // return 0; // disable bot
    return new Promise(async resolve => {
        app = new Client(OPTIONS);
        app.on('ready', async () => {
            this.log(`Logged in as ${app.user.tag}!`);
            server = await app.guilds.fetch('1219954701726912583');
            general = await server.channels.fetch('1219954701726912586');
            announcements = await server.channels.fetch('1219958741495975936');
            resolve(0);
        });
        listFiles(__dirname, 'events').then(events => app.on(events.slice(0, -('.js'.length)), (...x) => require('./events/' + events.slice(0, -('.js'.length))).execute(...x)));
        app.on('messageCreate', async message => {
            let __, user, content;
            if (message.author.bot) switch (message.author.id) {
                case THE_COMPUTER:
                    [__, user, content] = message.content.match(/`<([^>]+)>` (.+)/);
                    user = irc[user] ?? ('#' + user);
                    break;
                default:
                    return;
            } else {
                user = users[message.author.id] ?? ('#' + message.author.tag);
                content = message.content;
            }
            if (content.startsWith('!')) {
                if (user.startsWith('#') && !content.startsWith("!login")) {
                    message.reply('You are not logged in, please log in with `/login` first to connect your account to twitch.');
                    return;
                }
                messages[message.id] = message;
                sendClient('twitch', 'twitch', `#${user}@id=${message.id}`, content);
                setTimeout(() => { delete messages[message.id]; }, 60000);
            } else if (message.channel === general) {
                sendClient(this.ID, 'twitch', WASD.pack('!discord', user, content + 
                    Array.from(message.attachments.values()).map(x => "\n" + x.url).join(""))); // convert images to urls
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
    });
}
module.exports.send = (msg, user=null) => {
    if (!app) return;
    if (user) server.members.fetch(user).then(x => {
        general.send((`<@${x.id}> ` + msg.replace(/@everyone/g, "**@**everyone").replace(/@here/g, "**@**here")).slice(0, 2000));
    }).catch(_ => general.send(msg)); else general.send(msg);
}
module.exports.reply = (msg, id) => {
    if (!app) return;
    if (messages[id]) {
        messages[id].reply(msg.slice(0, 2000));
        delete messages[id];
    } else this.warn('Cannot find message id', id, 'to reply');
}
module.exports.announce = (msg) => {
    if (!app) return;
    announcements.send(`@everyone\n${msg}\n\nhttps://prod.kr/live\nhttps://prod.kr/v/screen`);
}
module.exports.addIRC = (twitch, user) => { irc[user] = twitch; return 0; }
module.exports.commands = {}