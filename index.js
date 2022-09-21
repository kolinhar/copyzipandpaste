'use strict';
const path = require('path');
const os = require('os');
const fs = require('fs');
const zip = require('zip-a-folder');

const { JsonWriter } = require('./src/libs/JsonWriter');
const { FileMover, FolderMover } = require('./src/libs/FileMover');
const { getCurrentFolderName, checkPathSync } = require('./src/libs/utils');

// console.log('it works');

let renamedZip = '';

/**
 * do the job
 * @param {boolean} dryRun
 */
async function cpzs(dryRun) {
  const maDate = new Date();
  const config = JsonWriter.getConfig();
  // console.log(`config`, config);

  const tempDestination = fs.mkdtempSync(
    path.join(
      os.tmpdir(),
      `cpzs-archive-${maDate.getFullYear()}-${
        maDate.getMonth() + 1
      }-${maDate.getDate()}_${maDate.getHours()}-${maDate.getMinutes()}-${maDate.getSeconds()}-${maDate.getMilliseconds()}`
    )
  );

  renamedZip = tempDestination.replace(/-\w*$/g, '');

  const finalDestination = config.backupFolder;

  if (!checkPathSync(finalDestination)) {
    fs.mkdirSync(finalDestination);
  }

  // copy
  await Promise.allSettled([
    ...config.files
      .filter((f) => f.save)
      .map((file) => {
        const fileName = path.basename(file.path);
        const newDest = `${tempDestination}${path.sep}${fileName}`;

        return FileMover.copyFile(file.path, newDest).then(
          () => {
            copyLogger(file.path);
          },
          (reason) => {
            console.error(`file '${file.path}' not copied`, reason);
          }
        );
      }),
    ...config.directories
      .filter((d) => d.save)
      .map((directory) => {
        const folderName = getCurrentFolderName(directory.path);
        const newDest = `${tempDestination}${path.sep}${folderName}`;

        //move it
        return FolderMover.copyFolder(directory.path, newDest).then(
          () => {
            copyLogger(directory.path);
          },
          (reason) => {
            console.error(`folder '${directory.path}' not copied`, reason);
          }
        );
      }),
  ]).then(null, (reason) => {
    console.log(`error during copy:`, reason);
  });

  // zip temp folder
  await zipIt();

  // send zip archive to its destination
  await sendZip();

  // delete temp folder and its archive
  await removeTemp();

  // deletion all files and folders needed
  await Promise.allSettled([
    ...config.files
      .filter((f) => f.delete)
      .map((file) => {
        if (dryRun === false) {
          //delete file
          return FileMover.removeFile(file.path).then(
            () => {
              console.log(`file '${file.path}' deleted`);
            },
            (reason) => {
              // maybe deletion could not be permitted for some kind of file (check permissions)
              console.error(`cannot remove file '${file.path}'`, reason);
            }
          );
        } else {
          copyLogger(file.path);
          return Promise.resolve();
        }
      }),
    ...config.directories
      .filter((d) => d.delete)
      .map((directory) => {
        if (dryRun === false) {
          console.log(`try to delete ${directory.path}`);

          //delete it
          return FolderMover.removeFolder(directory.path).then(
            () => {
              console.log(`folder '${directory.path}' deleted`);
            },
            (reason) => {
              // maybe deletion could not be permitted for some kind of folder (check permissions)
              console.error(`cannot remove folder '${directory.path}'`, reason);
            }
          );
        } else {
          copyLogger(directory.path);
          return Promise.resolve();
        }
      }),
  ]);
}

/**
 * zip temporary folder
 * @returns {Promise}
 */
async function zipIt() {
  console.log(
    `Zipping folder '${getCurrentFolderName(
      tempDestination
    )}' into archive '${getCurrentFolderName(renamedZip)}.zip'`
  );

  return zip.ZipAFolder.zip(tempDestination, `${renamedZip}.zip`).then(
    () => {
      console.log(`Archive done`);
    },
    (reason) => {
      console.log(`not zipped`, reason);
    }
  );
}

/**
 * copy zipped folder to its final emplacement and remove it from temp folder
 * @returns {Promise}
 */
async function sendZip() {
  console.log(`copying archive`);

  const dest = `${finalDestination}${path.sep}${getCurrentFolderName(
    renamedZip
  )}.zip`;
  console.log('sending archive to', dest);

  return FileMover.copyFile(`${renamedZip}.zip`, dest).then(
    async () => {
      console.log('zip file sended');
    },
    (reason) => {
      console.error(`cannot copy archive`, reason);
    }
  );
}

/**
 * delete temporaries files and folders
 * @returns {Promise}
 */
async function removeTemp() {
  if (!dryRun) {
    return await FileMover.removeFile(`${renamedZip}.zip`).then(
      async () => {
        console.log('archive file removed from temp folder');

        return await FolderMover.removeFolder(tempDestination).then(
          () => {
            console.log('temp folder removed');
          },
          (reason) => {
            console.error(`cannot remove temp folder`, reason);
          }
        );
      },
      (reason) => {
        console.error(`cannot remove archive file`, reason);
      }
    );
  } else {
    return Promise.resolve();
  }
}

/**
 * log status
 * @param {string} fileFolderPath
 */
function copyLogger(fileFolderPath) {
  console.log(`'${fileFolderPath}' copied`);
}

exports.cpzs = cpzs;
