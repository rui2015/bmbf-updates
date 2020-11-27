const fs = require("fs");
const path = require("path");

var config;

function createConfig(mainDirectory){
    try {
        if (!fs.existsSync("./config/")){
            fs.mkdirSync("./config/");
        }
        if (!fs.existsSync("./config/config.json")){
            fs.writeFileSync("./config/config.json", '{\n    "BOT_TOKEN": "replace with your Discord bot token",\n    "debug": false\n}');
            console.error('The config file doesn\'t exist');
            console.error('A new config file has been created');
            console.error('File location: ' + path.join(mainDirectory, "config", "config.json"));
            console.error('Change the config and restart the bot');
            process.exit(1);
        }
        config = JSON.parse(fs.readFileSync("./config/config.json"));
        exports.config = config;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

exports.createConfig = function (mainDirectory) {
    createConfig(mainDirectory);
}