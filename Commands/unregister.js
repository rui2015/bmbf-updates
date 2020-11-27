const Monitor = require("../Utils/MonitorUtils");

module.exports = {
	name: 'unregister',
	description: 'Disable BMBF Notifications for this server',
	execute(client, command, message, args) {
		runcommand(client, command, message, args);
	},
};

function runcommand(client, command, message, args){

    if (!message.member.hasPermission('MANAGE_GUILD')){
        // message.channel.send('Error: You need to have the `MANAGE_GUILD` permission in order to use this command.');
        return;
    }

    Monitor.updateMonitorChannel(message.guild.id, "0");
    message.channel.send('This server won\'t receive BMBF notifications.');

}