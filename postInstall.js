const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const { CONFIG_FILE_PATH } = require('./src/config/constants');

console.log(`post install script`);

child_process.exec(
  'npm config get cpzsInstallFolder',
  null,
  (err, stdout, stderr) => {
    if (err) throw stderr;

    // /!\ as it comes from CLI, it ends with a '\n' character
    stdout = stdout.split('\n')[0];

    if (stdout !== 'undefined') {
      console.log('config founded from npm', stdout);
      fs.copyFile(stdout, CONFIG_FILE_PATH, (err) => {
        if (err) throw err;

        fs.rm(path.dirname(stdout), { recursive: true }, (err) => {
          if (err) throw err;
          console.log('temp folder removed');

          child_process.exec(
            'npm config delete cpzsInstallFolder',
            null,
            (err, _stdout, stderr) => {
              if (err) throw stderr;

              console.log('key config folder deleted');
            }
          );
        });
      });
    } else {
      console.log(`no saved config found, normal install`);
    }
  }
);
