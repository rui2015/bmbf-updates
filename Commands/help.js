const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Get a command list',
	execute(client, command, message, args) {
		runcommand(client, command, message, args);
	},
};

function runcommand(client, command, message, args){
	var embed = new Discord.MessageEmbed();
	embed.setAuthor(client.user.username, client.user.displayAvatarURL());
	embed.setTitle('Available Commands');
    client.commands.array().forEach((cmd) => {

		// Server Admin Commands
		if ((cmd.name == "unregister") && (!message.member.hasPermission('MANAGE_GUILD')) && (message.member.id != '456794789656920065')) return;
		if ((cmd.name == "register") && (!message.member.hasPermission('MANAGE_GUILD')) && (message.member.id != '456794789656920065')) return;
		if ((cmd.name == "prefix") && (!message.member.hasPermission('MANAGE_GUILD')) && (message.member.id != '456794789656920065')) return;
		if ((cmd.name == "role") && (!message.member.hasPermission('MANAGE_GUILD')) && (message.member.id != '456794789656920065')) return;

		// Bot owner commands
		if ((cmd.name == "serverlist") && (message.member.id != '456794789656920065')) return;
		
        embed.addField(message.content.split(command)[0] + cmd.name, cmd.description);
	});
	message.channel.send(embed);
}