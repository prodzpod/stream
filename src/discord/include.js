const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { getIdentifier } = require('../@main/util_client');
const { listFiles } = require('../@main/util_server');
const { sendClient, data } = require('../@main/include');
const OPTIONS = { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent], partials: [Partials.Message, Partials.Channel, Partials.Reaction] };
module.exports.ID = 'discord';
module.exports.log = (...stuff) => console.log('[DISCORD]', ...stuff);
module.exports.warn = (...stuff) => console.warn('[DISCORD]', ...stuff);
module.exports.error = (...stuff) => console.error('[DISCORD]', ...stuff);
let app, server, general;
let logins = {};
let users = {};
let messages = {};
module.exports.attemptLogin = (str, user) => {
    str = str.trim();
    let k = Object.keys(logins).find(x => logins[x] == str);
    if (k) delete logins[k];
    users[k] = user;
    return k;
}
module.exports.init = async () => {
    users = {};
    messages = {};
    let _u = data().user;
    for (let k in _u) if (_u[k].discord) users[_u[k].discord] = k;
    if (app) await app.destroy();
    return new Promise(async resolve => {
        app = new Client(OPTIONS);
        app.on('ready', async () => {
            this.log(`Logged in as ${app.user.tag}!`);
            server = await app.guilds.fetch('1219954701726912583');
            general = await server.channels.fetch('1219954701726912586');
            resolve(0);
        });
        listFiles(__dirname, 'events').then(events => app.on(events.slice(0, -('.js'.length)), (...x) => require('./events/' + events.slice(0, -('.js'.length))).execute(...x)));
        app.on('messageCreate', async message => {
            if (message.author.bot) return;
            let user = users[message.author.id] ?? ('#' + message.author.tag);
            if (message.content.startsWith('!')) {
                if (user.startsWith('#')) {
                    interaction.reply('You are not logged in, please log in with `/login` first to connect your account to twitch.');
                    return;                 
                }
                messages[message.id] = message;
                sendClient('twitch', 'twitch', `#${user}@id=${message.id} ${message.content}`);
                setTimeout(() => { delete messages[message.id]; }, 60000);
            } else if (message.channel === general) sendClient(this.ID, 'twitch', `prodzpod !!discord ${user} ${message.content}`);
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
                    sendClient(this.ID, 'twitch', 'prodzpod !restart');
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
        general.send(`<@${x.id}> ` + msg);
    }).catch(_ => general.send(msg)); else general.send(msg);
}
module.exports.reply = (msg, id) => {
    if (!app) return;
    if (messages[id]) {
        messages[id].reply(msg);
        delete messages[id];
    } else this.warn('Cannot find message id', id, 'to reply');
}
module.exports.commands = {}