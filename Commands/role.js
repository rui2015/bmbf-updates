const Monitor = require("../Utils/MonitorUtils");

module.exports = {
	name: 'role',
	description: 'Change the role that gets pinged when a new BMBF version is released',
	async execute(client, command, message, args) {
		await runcommand(client, command, message, args);
	},
};

async function runcommand(client, command, message, args){

    if (!message.member.hasPermission('MANAGE_GUILD')){
        // message.channel.send('Error: You need to have the `MANAGE_GUILD` permission in order to use this command.');
        return;
    }

    if (args[0]){

        if (args[0] == "0"){

            Monitor.updateMonitorRole(message.guild.id, "0");
            message.channel.send('No roles will be pinged when a new BMBF version is released')

        } else {

            var newRole;
        
            const pingedRole = message.mentions.roles.first();
            if (!pingedRole){
                const roleByName = message.guild.roles.cache.find(role => role.name == args[0]);
                if (!roleByName){
                    const roleByID = message.guild.roles.cache.find(role => role.id == args[0]);
                    if (!roleByID){
                        message.channel.send('Role not found.');
                        return;
                    } else newRole = roleByID;
                } else newRole = roleByName;
            } else newRole = pingedRole;

            Monitor.updateMonitorRole(message.guild.id, newRole.id);
            message.channel.send('New role to be pinged: `' + newRole.name + '` (' + newRole.id + ')');

        }

    } else {

        await Monitor.getRole(message.guild.id);
        const role = message.guild.roles.cache.find(role => role.id == Monitor.roleToPingID);
        if(!role){
            message.channel.send('Currently, no roles will get pinged when a new BMBF version is released');
            return;
        }
        message.channel.send('Current role that will get pinged: `' + role.name + '` (' + role.id + ')');

    }

}