const fs = require("fs");
const path = require("path");
const os = require("os");
const child_process = require("child_process");
const {JsonWriter} = require("./libs/JsonWriter");
const {absolutingPath} = require("./libs/utils");
const {configFilePath} = require("./config/constants");

const CONFIG_FILE_PATH = absolutingPath(`${__dirname}${configFilePath}`);
const isConfigFileExists = fs.existsSync(CONFIG_FILE_PATH);

console.log(`${CONFIG_FILE_PATH}`, isConfigFileExists === true ? "exists" : "doesn't exist");

if (isConfigFileExists === true) {
    console.log("saving config file");
    //save the config file
    const config = JsonWriter.getConfig();
    // console.log(config);
    fs.mkdtemp(path.join(os.tmpdir(), 'config-'), (err, directory) => {
        if (err) throw err;

        // save path name somewhere
        child_process.exec(`npm config set cpzsBackupFolder ${path.join(directory, "files.json")}`, null, (error)=>{
            if (error) throw error;
        });
        fs.createReadStream(CONFIG_FILE_PATH).pipe(fs.createWriteStream(path.join(directory, "files.json")));
        console.log("directory", path.dirname(path.join(directory, "files.json")));
    });
} else {
    //#BALEK
}
