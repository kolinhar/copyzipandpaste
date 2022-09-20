'use strict';
const path = require('path');
const os = require('os');
const fs = require('fs');
const zip = require('zip-a-folder');

const { JsonWriter } = require('./src/libs/JsonWriter');
const { FileMover, FolderMover } = require('./src/libs/FileMover');
const { getCurrentFolderName, checkPathSync } = require('./src/libs/utils');

// console.log('it works');

/**
 *
 * @param {boolean} dryRun
 */
function cpzs(dryRun) {
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
  const renamedZip = tempDestination.replace(/-\w*$/g, '');

  const finalDestination = config.backupFolder;

  let isCopied = false;

  const counter = {
    files: config.files.length,
    directories: config.directories.length,
  };

  if (!checkPathSync(finalDestination)) {
    fs.mkdirSync(finalDestination);
  }

  config.files.forEach((file) => {
    const fileName = path.basename(file.path);
    const newDest = `${tempDestination}${path.sep}${fileName}`;

    if (file.save === true) {
      //move file
      FileMover.copyFile(file.path, newDest).then(
        () => {
          if (file.delete === true && dryRun === false) {
            //delete file
            FileMover.removeFile(file.path, () => {
              counter.files--;
              countDown(counter, file.path);
            });
          } else {
            counter.files--;
            countDown(counter, file.path);
          }
        },
        (reason) => {
          console.error(`file not copied`, reason);
        }
      );
    } else {
      if (file.delete === true && dryRun === false) {
        //delete file
        FileMover.removeFile(file.path).then(
          () => {
            counter.files--;
            countDown(counter, file.path);
          },
          (reason) => {
            console.error(`file not removed`, reason);
          }
        );
      } else {
        counter.files--;
        countDown(counter, file.path);
      }
    }
  });

  config.directories.forEach((directory, ind, arr) => {
    console.log(`${ind} current:`, arr[ind]);

    const folderName = getCurrentFolderName(directory.path);
    const newDest = `${tempDestination}${path.sep}${folderName}`;

    if (directory.save === true) {
      console.log(`try to copy ${directory.path}`);

      //move it
      FolderMover.copyFolder(directory.path, newDest).then(
        () => {
          console.log(`${folderName} and its content has been copied`);
          //then
          if (directory.delete === true && dryRun === false) {
            //delete it
            FolderMover.removeFolder(directory.path).then(
              () => {
                counter.directories--;
                countDown(counter, directory.path);
              },
              (reason) => {
                console.error(`cannot remove folder ${reason}`);
              }
            );
          } else {
            console.log(`${directory.path} preserved`);

            counter.directories--;
            countDown(counter, directory.path);
          }
        },
        (reason) => {
          console.error(`folder not copied`, reason);
        }
      );
    } else {
      if (directory.delete === true && dryRun === false) {
        //only delete it
        FolderMover.removeFolder(directory.path).then(
          () => {
            counter.directories--;
            countDown(counter, directory.path);
          },
          (reason) => {
            console.error(`cannot remove folder ${reason}`);
          }
        );
      } else {
        console.log(
          `${directory.path} won't be moved or deleted... So why did you add it?`
        );
        counter.directories--;
        countDown(counter, directory.path);
      }
    }
  });

  /**
   * zip temp folder
   * @returns {Promise}
   */
  function zipIt() {
    console.log(`Zipping ${tempDestination} to ${renamedZip}.zip`);
    return zip.ZipAFolder.zip(tempDestination, `${renamedZip}.zip`).then(
      () => {
        console.log(`zipped`);
      },
      (reason) => {
        console.log(`not zipped`, reason);
      }
    );
  }

  /**
   * copy zipped folder to its final emplacement and remove it from temp folder
   */
  function sendZip() {
    console.log(`copying archive`);

    const dest = `${finalDestination}${path.sep}${getCurrentFolderName(
      renamedZip
    )}.zip`;
    console.log('sending archive to', dest);

    !dryRun &&
      FolderMover.removeFolder(tempDestination).then(
        () => {
          console.log('temp folder removed');
        },
        (reason) => {
          console.error(`cannot remove temp folder ${reason}`);
        }
      );

    FileMover.copyFile(`${renamedZip}.zip`, dest).then(
      () => {
        console.log('zip file sended');

        !dryRun &&
          FileMover.removeFile(`${renamedZip}.zip`).then(
            () => {
              console.log('zip file removed from temp folder');
            },
            (reason) => {
              console.error(`cannot remove temp folder ${reason}`);
            }
          );
      },
      (reason) => {
        console.error(`cannot copy archive ${reason}`);
      }
    );
  }

  /**
   * log status
   * @param {{files: number, directories: number}} counter
   */
  function countDown(counter, fileFolderPath) {
    if (isCopied === true) return;

    if (counter.files === 0 && counter.directories === 0) {
      isCopied = true;

      zipIt().then(sendZip, (reason) => {
        console.error(`not zipped:`, reason);
      });
    } else {
      console.log(`${fileFolderPath} ok\n`);
    }
  }
}

exports.cpzs = cpzs;
