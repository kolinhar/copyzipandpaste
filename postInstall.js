const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const { absolutingPath } = require('./libs/utils');
const { configFilePath } = require('./config/constants');

const CONFIG_FILE_PATH = absolutingPath(`${__dirname}${configFilePath}`);

child_process.exec('npm config get cpzsBackupFolder', null, (error, stdout) => {
  if (error) throw error;

  if (stdout) {
    // /!\ as it comes from CLI, it ends with a '\n' character
    stdout = stdout.split('\n')[0];
    console.log('config founded from npm', stdout);
    fs.createReadStream(stdout)
      .pipe(fs.createWriteStream(CONFIG_FILE_PATH))
      .addListener('close', () => {
        fs.rmdir(path.dirname(stdout), { recursive: true }, (err) => {
          if (err) throw err;
          console.log('temp folder removed');
        });
      });
    child_process.exec(
      'npm config delete cpzsBackupFolder',
      null,
      (e, so, se) => {
        console.log('key config folder deleted');
      }
    );
  }
});
