module.exports = {
	name: 'invite',
	description: 'Get the invite link to add this bot to other servers!',
	execute(client, command, message, args) {
		runcommand(client, command, message, args);
	},
};

function runcommand(client, command, message, args){
    message.reply('here is the Invite Link:\n<https://discord.com/api/oauth2/authorize?client_id=766040022414786560&permissions=150528&scope=bot>');
}