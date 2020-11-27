const fs = require('fs');

var guilds;

function createMonitorFile(mainDirectory){
    try {
        if (!fs.existsSync("./config/")){
            fs.mkdirSync("./config/");
        }
        if (!fs.existsSync("./config/monitor.json")){
            console.log('Monitor file doesn\'t exist, creating a new one');
            fs.writeFileSync("./config/monitor.json", '{"guilds":[]}');
        }
        guilds = JSON.parse(fs.readFileSync("./config/monitor.json"));
        exports.guilds = guilds;
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}

function newGuild(guildID){
    const guildIDstring = guildID.toString();
    guilds['guilds'][guilds['guilds'].length] = JSON.parse('{"guildID":"' + guildIDstring + '", "monitorChannelID":"0", "role":"0"}');
    fs.writeFileSync("./config/monitor.json", JSON.stringify(guilds));
    exports.guilds = guilds;
}

function removeGuild(guildID){
    const guildIDstring = guildID.toString();

    var guildIndex = 999;
    for (i = 0; i < guilds['guilds'].length; i++){
        if (guilds['guilds'][i]['guildID'] == guildIDstring) guildIndex = i; 
    }

    delete guilds['guilds'][guildIndex];
    
    const newGuildsFile = JSON.stringify(guilds).replace(',null', '');
    fs.writeFileSync("./config/monitor.json", newGuildsFile);
    guilds = JSON.parse(newGuildsFile);
    exports.guilds = guilds;
}

function updateMonitorChannel(guildID, monitorChannelID){
    guilds['guilds'].forEach(guild => {
        if (guild['guildID'] == guildID){
            guild['monitorChannelID'] = monitorChannelID;
        }
    });
    fs.writeFileSync("./config/monitor.json", JSON.stringify(guilds));
    exports.guilds = guilds;
}

function updateMonitorRole(guildID, roleID){
    guilds['guilds'].forEach(guild => {
        if (guild['guildID'] == guildID){
            guild['role'] = roleID;
        }
    });
    fs.writeFileSync("./config/monitor.json", JSON.stringify(guilds));
    exports.guilds = guilds;
}

async function getRole(guildID){
    let roleToPing = null;
    guilds['guilds'].forEach(guild => {
        if (guild['guildID'] == guildID.toString()){
            roleToPing = guild['role'];
        }
    });
    exports.roleToPingID = roleToPing;
}

async function getChannel(guildID){
    let guildMonitorChannel = null;
    guilds['guilds'].forEach(guild => {
        if (guild['guildID'] == guildID.toString()){
            guildMonitorChannel = guild['monitorChannelID'];
        }
    });
    exports.guildMonitorChannel = guildMonitorChannel;
}

exports.createMonitorFile = function (mainDirectory) {
    createMonitorFile(mainDirectory);
}

exports.updateMonitorChannel = function (guildID, monitorChannelID){
    updateMonitorChannel(guildID, monitorChannelID);
}

exports.updateMonitorRole = function (guildID, roleID){
    updateMonitorRole(guildID, roleID);
}

exports.getChannel = async function (guildID){
    await getChannel(guildID);
}

exports.getRole = async function (guildID){
    await getRole(guildID);
}

exports.newGuild = function (guildID){
    newGuild(guildID);
}

exports.removeGuild = function (guildID){
    removeGuild(guildID);
}