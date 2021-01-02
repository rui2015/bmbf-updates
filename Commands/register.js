const Monitor = require("../Utils/MonitorUtils");

module.exports = {
	name: 'register',
	description: 'Registers this channel to receive BMBF notifications',
	execute(client, command, message, args) {
		runcommand(client, command, message, args);
	},
};

function runcommand(client, command, message, args){

    if ((!message.member.hasPermission('MANAGE_GUILD')) && (message.member.id != '456794789656920065')){
        // message.channel.send('Error: You need to have the `MANAGE_GUILD` permission in order to use this command.');
        return;
    }

    Monitor.updateMonitorChannel(message.guild.id, message.channel.id);
    message.channel.send('Channel `' + message.channel.name + '` (' + message.channel.id + ') registered to receive BMBF notifications.');

}