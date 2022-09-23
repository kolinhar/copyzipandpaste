const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');
const { CONFIG_FILE_PATH } = require('./src/config/constants');

console.log(`pre install script`);

console.log(`config file to find: ${CONFIG_FILE_PATH}`);

const isConfigFileExists = fs.existsSync(CONFIG_FILE_PATH);

if (isConfigFileExists === true) {
  console.log('saving config file');
  //save the config file
  fs.mkdtemp(path.join(os.tmpdir(), 'cpzs-config-'), (err, directory) => {
    if (err) throw err;

    const configFilePathTemp = path.join(directory, 'files.json');

    // save path name in npm config
    child_process.exec(
      `npm config set cpzsInstallFolder ${configFilePathTemp}`,
      null,
      (error, _stdout, stderr) => {
        if (error) throw stderr;

        fs.copyFile(CONFIG_FILE_PATH, configFilePathTemp, (err) => {
          if (err) throw err;

          console.log('directory', path.dirname(configFilePathTemp));
        });
      }
    );
  });
} else {
  // normal install
  console.log('no config file found, normal install');
}
