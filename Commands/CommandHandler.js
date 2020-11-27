const fs = require("fs");

function runCommand(client, message, command, args){
    if (!client.commands.get(command)){
        console.log('\nUser ' + message.author.username + ' tried to execute the command ' + command + ', but it doesn\'t exist.');
        console.log(`Guild: ${message.guild.name} (${message.guild.id})`);
        console.log(`Channel: ${message.channel.name} (${message.channel.id})`);
        return;
    }
    console.log('\nUser ' + message.author.username + ' executed the command ' + command);
    console.log(`Guild: ${message.guild.name} (${message.guild.id})`);
    console.log(`Channel: ${message.channel.name} (${message.channel.id})`);
    client.commands.get(command).execute(client, command, message, args);
}

async function loadCommands(client){
    fs.readdir("./Commands", function(err, files){
        files.forEach(file => {
            if (file == 'CommandHandler.js') return;
            if (file == 'template.js') return;
            const command = require(`./${file}`);
	        client.commands.set(command.name, command);
        });
    });
}

exports.runCommand = function (client, message, command, args) {
    runCommand(client, message, command, args);
}

exports.loadCommands = function (client) {
    loadCommands(client);
}