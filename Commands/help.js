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

		if ((cmd.name == "unregister") && (!message.member.hasPermission('MANAGE_GUILD'))) return;
		if ((cmd.name == "register") && (!message.member.hasPermission('MANAGE_GUILD'))) return;
		if ((cmd.name == "role") && (!message.member.hasPermission('MANAGE_GUILD'))) return;
		
        embed.addField(message.content.split(command)[0] + cmd.name, cmd.description);
	});
	message.channel.send(embed);
}