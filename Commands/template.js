module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(client, command, message, args) {
		runcommand(client, command, message, args);
	},
};

function runcommand(client, command, message, args){
    message.channel.send('Pong.');
}