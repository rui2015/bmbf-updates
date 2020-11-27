const fs = require("fs");

var guilds;

function createGuildFile(mainDirectory){
    try {
        if (!fs.existsSync("./config/")){
            fs.mkdirSync("./config/");
        }
        if (!fs.existsSync("./config/guilds.json")){
            console.log('Guilds file doesn\'t exist, creating a new one');
            fs.writeFileSync("./config/guilds.json", '{"guilds":[]}');
        }
        guilds = JSON.parse(fs.readFileSync("./config/guilds.json"));
        exports.guilds = guilds;
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}

function newGuild(guildID){
    const guildIDstring = guildID.toString();
    guilds['guilds'][guilds['guilds'].length] = JSON.parse('{"guildID":"' + guildIDstring + '", "prefix":"BMBFMonitor!"}');
    //guilds['guilds'][guilds['guilds'].length]['guildID'] = guildID;
    //guilds['guilds'][guilds['guilds'].length]['prefix'] = "!";
    fs.writeFileSync("./config/guilds.json", JSON.stringify(guilds));
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
    fs.writeFileSync("./config/guilds.json", newGuildsFile);
    guilds = JSON.parse(newGuildsFile);
    exports.guilds = guilds;
}

function updateGuildPrefix(guildID, newPrefix){
    guilds['guilds'].forEach(guild => {
        if (guild['guildID'] == guildID){
            guild['prefix'] = newPrefix;
        }
    });
    fs.writeFileSync("./config/guilds.json", JSON.stringify(guilds));
    exports.guilds = guilds;
}

async function getGuildPrefix(guildID){
    let guildPrefix = null;
    // console.log('[GuildUtils.getGuildPrefix] Checking guild prefix for ' + guildID);
    guilds['guilds'].forEach(guild => {
        // console.log('[GuildUtils.getGuildPrefix] Checking if ' + guild['guildID'] + ' is equal to ' + guildID.toString());
        if (guild['guildID'] == guildID.toString()){
            // console.log('[GuildUtils.getGuildPrefix] Check! They are equal!');
            guildPrefix = guild['prefix'];
            // console.log('[GuildUtils.getGuildPrefix] Setting guildPrefix to ' + guild['prefix']);
        }
    });
    // console.log('[GuildUtils.getGuildPrefix] Returning guildPrefix ' + guildPrefix);
    exports.guildPrefix = guildPrefix;
}

exports.createGuildFile = function (mainDirectory) {
    createGuildFile(mainDirectory);
}

exports.updateGuildPrefix = function (guildID, newPrefix){
    updateGuildPrefix(guildID, newPrefix);
}

exports.getGuildPrefix = async function (guildID){
    await getGuildPrefix(guildID);
}

exports.newGuild = function (guildID){
    newGuild(guildID);
}

exports.removeGuild = function (guildID){
    removeGuild(guildID);
}