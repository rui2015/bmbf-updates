const GuildUtils = require('../Utils/GuildUtils');

module.exports = {
	name: 'prefix',
	description: 'Change the bot prefix',
	execute(client, command, message, args) {
		runcommand(client, command, message, args);
	},
};

function runcommand(client, command, message, args){

    if (!message.member.hasPermission('MANAGE_GUILD')) return;

    if (args.length == 0){
        message.channel.send('Correct usage: `' + message.content.split(command)[0] + 'prefix [newPrefix]`');
    } else if (args.length == 1){
        GuildUtils.updateGuildPrefix(message.guild.id, args[0]);
        message.channel.send('Prefix set to `' + args[0] + '`');
    }
}