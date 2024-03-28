const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
let cmds = [
    new SlashCommandBuilder().setName('login').setDescription('Link Discord to Twitch'),
    new SlashCommandBuilder().setName('reboottwitchbot').setDescription('Twitch Bots Down'),
]
rest.put(Routes.applicationCommands(process.env.DISCORD_ID), { body: cmds.map(x => x.toJSON()) });