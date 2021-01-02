const fs = require("fs");
const https = require('https');
const ID = require("./IDUtils");

var BMBFStableID = '';
var BMBFNightlyID = '';
var BMBFStableTag = '';
var BMBFNightlyDate = '';
var BMBFStableIDDownload = '';
var BMBFStableCreated = '';

var nightlyJSON;
var stableJSON;

var newNightly = false;
var newStable = false;

var message;

var tempStableID;

async function downloadAndCheckFile(debug, mainDir){

    if (debug) console.log('[BMBFUtils.downloadAndCheckFile] Function called');

    if (!fs.existsSync('./json/')) fs.mkdirSync('./json/');
    if (fs.existsSync('./json/nightly.json')) fs.unlinkSync('./json/nightly.json');
    if (fs.existsSync('./json/stable.json')) fs.unlinkSync('./json/stable.json');

    try {
        await download('https://bmbf.dev/stable/json', './json/stable.json');
        if (debug) console.log('[BMBFUtils.downloadAndCheckFile] Downloaded Stable file');
    } catch (error) {
        console.log('Error downloading stable file:\n' + error);
        console.log('Returning.');
        return;
    }

    try {
        await download('https://bmbf.dev/nightly/json', './json/nightly.json');
        if (debug) console.log('[BMBFUtils.downloadAndCheckFile] Downloaded Nightly file');
    } catch (error) {
        console.log('Error downloading nightly file:\n' + error);
        console.log('Returning.');
        return;
    }

    nightlyJSON = JSON.parse(fs.readFileSync('./json/nightly.json'));
    stableJSON = JSON.parse(fs.readFileSync('./json/stable.json'));

    const newNightlyID = nightlyJSON[0]['id'];
    const newNightlyDate = nightlyJSON[0]['created'];

    const newStableID = stableJSON[0]['id'];
    const newStableTag = stableJSON[0]['tag'];
    
    for (i = 0; i < stableJSON[0]["assets"].length; i++){
        if (stableJSON[0]["assets"][i]["name"] == "com.weloveoculus.BMBF.apk") tempStableID = i;
    }
    const newStableIDDownload = stableJSON[0]['assets'][tempStableID]['id'];
    const newStableCreated = stableJSON[0]['assets'][tempStableID]['created'];

    if (newNightlyID != BMBFNightlyID){
        if (debug) console.log('[BMBFUtils.downloadAndCheckFile] New nightly found');
        newNightly = true;
        BMBFNightlyID = newNightlyID;
        BMBFNightlyDate = newNightlyDate;
        ID.changeNightlyID(BMBFNightlyID, mainDir);
    } else {
        if (debug) console.log('[BMBFUtils.downloadAndCheckFile] New nightly not found');
    }

    if (newStableID != BMBFStableID){
        if (debug) console.log('[BMBFUtils.downloadAndCheckFile] New stable found');
        newStable = true;
        BMBFStableCreated = newStableCreated;
        BMBFStableID = newStableID;
        BMBFStableIDDownload = newStableIDDownload;
        BMBFStableTag = newStableTag;
        ID.changeStableID(BMBFStableID, mainDir);
    } else {
        if (debug) console.log('[BMBFUtils.downloadAndCheckFile] New stable not found');
    }
}

async function getMessageInternal(debug, mainDir){

    ID.checkIDs();

    BMBFStableID = ID.stableID;
    BMBFNightlyID = ID.nightlyID;

    if (debug) console.log('\n[BMBFUtils.getMessage] Function called');

    await downloadAndCheckFile(debug, mainDir);

    if (debug) console.log('[BMBFUtils.getMessage] downloadAndCheckFile finished');

    if (newNightly){
        if (debug) console.log('[BMBFUtils.getMessage] New nightly found');
        newNightly = false;
        message = `New BMBF Nightly:\nID: \`${BMBFNightlyID}\`\nCreated at: \`${BMBFNightlyDate}\`\nDownload Link: <https://bmbf.dev/nightly/${BMBFNightlyID}>`;
    } else if (newStable){
        if (debug) console.log('[BMBFUtils.getMessage] New stable found');
        newStable = false;
        message = `New BMBF Stable:\n` + 
            'Tag: `' + BMBFStableTag + '`\n' +
            'Created at: `' + BMBFStableCreated + '`\n' + 
            `Download Link: <https://bmbf.dev/stable/${BMBFStableIDDownload}>`; 
    } else message = "NOTUPDATED";

    if (debug) console.log('[BMBFUtils.getMessage] Exporting message');

    exports.message = message;

}

const download = (url, path) => new Promise((resolve, reject) => {
    https.get(url, response => {
        const statusCode = response.statusCode;
    
        if (statusCode !== 200) {
            return reject('Download error!');
        }
    
        const writeStream = fs.createWriteStream(path);
        response.pipe(writeStream);
    
        writeStream.on('error', () => reject('Error writing to file!'));
        writeStream.on('finish', () => writeStream.close(resolve));
    });}).catch(err => console.error(err));

exports.getMessage = async function getMessage(debug, mainDir){
    await getMessageInternal(debug, mainDir);
}