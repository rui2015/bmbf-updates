const Discord = require("discord.js");
const fs = require("fs");
const CommandHandler = require("./Commands/CommandHandler");
const ConfigUtils = require("./Utils/ConfigUtils");
const BMBF = require("./Utils/BMBFUtils");
const MonitorUtils = require("./Utils/MonitorUtils");
const IDUtils = require("./Utils/IDUtils");
const GuildUtils = require("./Utils/GuildUtils");
const { setIntervalAsync } = require('set-interval-async/dynamic');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Create config
ConfigUtils.createConfig(__dirname);
const config = ConfigUtils.config;
const debugEnabled = config['debug'];

// Create guild config
GuildUtils.createGuildFile(__dirname);

// Create monitor config
MonitorUtils.createMonitorFile(__dirname);

// Create ID file
IDUtils.createIDFile(__dirname);
IDUtils.checkIDs();
console.log('\nLatest nightly found: ' + IDUtils.nightlyID);
console.log('Latest stable found: ' + IDUtils.stableID);

// Login bot para Discord
client.login(config['BOT_TOKEN']);

// Bot pronto
client.on('ready', async function(){
    await CommandHandler.loadCommands(client);
    console.log('\nBot logged in to Discord.\nBot ID: ' + client.user.id + '\nBot Tag: ' + client.user.tag + '\n');
    console.log('Guilds list:');
    client.guilds.cache.forEach(Guild => {
        console.log(` - ${Guild.name} (${Guild.id})`);
        GuildUtils.getGuildPrefix(Guild.id);
        if (GuildUtils.guildPrefix == null){
            console.log('Guild ' + Guild.id + ' not found on the monitor config. Registering new guild...');
            GuildUtils.newGuild(Guild.id);
        }
        MonitorUtils.getChannel(Guild.id);
        if (MonitorUtils.guildMonitorChannel == null){
            console.log('Guild ' + Guild.id + ' not found on the monitor config. Registering new guild...');
            MonitorUtils.newGuild(Guild.id);
        }
    });
    if (debugEnabled) console.log('Debug mode enabled!');
    setIntervalAsync(async () => {
        if (debugEnabled) console.log('[Monitor] Calling getMessage');
        await BMBF.getMessage(debugEnabled, __dirname);
        if (BMBF.message == "NOTUPDATED") return;
        console.log('\nNew BMBF Release. Sending message to guilds:')
        client.guilds.cache.forEach(function(Guild) {
            MonitorUtils.getChannel(Guild.id);
            if (MonitorUtils.guildMonitorChannel == "0") return;
            const channelToSend = Guild.channels.cache.find(ch => ch.id == MonitorUtils.guildMonitorChannel);
            if (!channelToSend){
                console.log('\nChannel to send invalid.\nguildMonitorChannel: ' + MonitorUtils.guildMonitorChannel + '\nGuild: ' + Guild.id);
                return;
            }
            console.log(` - ${Guild.name} (${Guild.id})`);
            console.log(`   - Channel: ${channelToSend.name} (${channelToSend.id})`);
            MonitorUtils.getRole(Guild.id);
            if (MonitorUtils.roleToPingID == "0"){
                channelToSend.send(BMBF.message);
            } else {
                channelToSend.send(`<@&${MonitorUtils.roleToPingID}>\n${BMBF.message}`);
            }
        });
    }, 60 * 1000);
});

// On Server Join
client.on('guildCreate', async function(guild) {
    console.log('\nBot added to Guild ' + guild.name + ' (' + guild.id + ')');
    console.log('Registering on the config...');
    GuildUtils.newGuild(guild.id);
    MonitorUtils.newGuild(guild.id);
    client.users.fetch('456794789656920065').then(user => {
        user.send('Bot added to guild ' + guild.name + ' (' + guild.id + ')');
    });
});

// On Server Quit
client.on('guildDelete', async function(guild) {
    console.log('\nBot removed from Guild ' + guild.name + ' (' + guild.id + ')');
    console.log('Removing from the config...');
    GuildUtils.removeGuild(guild.id);
    MonitorUtils.removeGuild(guild.id);
    client.users.fetch('456794789656920065').then(user => {
        user.send('Bot removed from guild ' + guild.name + ' (' + guild.id + ')');
    });
});

client.on('message', async function (message) {
    if (message.channel.type == "dm") return;
    if (message.author.bot) return;
    await GuildUtils.getGuildPrefix(message.guild.id);
    if (message.content.startsWith(GuildUtils.guildPrefix)){
        const command = message.content.split(' ')[0].slice(GuildUtils.guildPrefix.length);
        const args = message.content.split(' ').slice(1);
        CommandHandler.runCommand(client, message, command, args);
    }
});