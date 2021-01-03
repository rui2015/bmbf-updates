const MonitorUtils = require('../Utils/MonitorUtils');

module.exports = {
	name: 'serverlist',
	description: 'Shows a list of servers, channels and roles to be pinged',
	execute(client, command, message, args) {
		runcommand(client, command, message, args);
	},
};

function runcommand(client, command, message, args){
    if (message.author.id != '456794789656920065') return;
    
    var list = '<@456794789656920065>, here is the server list\n\n';

    client.guilds.cache.forEach(function(Guild) {

        if (list.length > 1900){
            message.channel.send(list);
            list = '';
        }

        MonitorUtils.getChannel(Guild.id);
        MonitorUtils.getRole(Guild.id);

        var channelID = MonitorUtils.guildMonitorChannel;
        var roleID = MonitorUtils.roleToPingID;
        var channel, role;

        if (channelID != '0') channel = client.channels.cache.find(ch => ch.id == channelID);
        if (roleID != '0') role = client.guilds.cache.find(g => g.id == Guild.id).roles.cache.find(r => r.id == roleID);

        list += ` - Server: ${Guild.name} (${Guild.id})\n`;

        if (channel){
            list += `    - Channel: ${channel.name} (${channel.id})\n`;
        } else list += `    - Channel: ---\n`;

        if (role){
            list += `    - Role: ${role.name} (${role.id})\n`;
        } else list += `    - Role: ---\n`;

        list += '\n';

    })
    
    message.channel.send(list);

}