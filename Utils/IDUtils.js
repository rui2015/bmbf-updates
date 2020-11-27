const fs = require("fs");
const path = require("path");

var id;

function createIDFile(mainDirectory){
    try {
        if (!fs.existsSync(path.join(mainDirectory, "config"))){
            fs.mkdirSync(path.join(mainDirectory, "config"));
        }
        if (!fs.existsSync(path.join(mainDirectory, "config", "id.json"))){
            fs.writeFileSync(path.join(mainDirectory, "config", "id.json"), '{\n    "stableID": "0",\n    "nightlyID": "0"\n}');
            console.log('ID file not found. Creating...');
        }
        id = JSON.parse(fs.readFileSync(path.join(mainDirectory, "config", "id.json")));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

function checkIDs(){
    exports.nightlyID = id['nightlyID'];
    exports.stableID = id['stableID'];
}

function changeNightlyID(newID, mainDirectory){
    id['nightlyID'] = newID;
    fs.writeFileSync(path.join(mainDirectory, "config", "id.json"), JSON.stringify(id));
}

function changeStableID(newID, mainDirectory){
    id['stableID'] = newID;
    fs.writeFileSync(path.join(mainDirectory, "config", "id.json"), JSON.stringify(id));
}

exports.createIDFile = function (mainDirectory) {
    createIDFile(mainDirectory);
}

exports.checkIDs = function() {
    checkIDs();
}

exports.changeNightlyID = function(newID, mainDirectory) {
    changeNightlyID(newID, mainDirectory);
}

exports.changeStableID = function(newID, mainDirectory) {
    changeStableID(newID, mainDirectory);
}