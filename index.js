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
  const config = JsonWriter.getConfig();
  const tempDestination = fs.mkdtempSync(path.join(os.tmpdir(), 'cpzs-'));
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
      FileMover.copyFile(file.path, newDest).addListener('close', () => {
        if (file.delete === true && dryRun === false) {
          //delete file
          FileMover.removeFile(file.path, () => {
            counter.files--;
            countDown(counter);
          });
        } else {
          counter.files--;
          countDown(counter);
        }
      });
    } else {
      if (file.delete === true && dryRun === false) {
        //delete file
        FileMover.removeFile(file.path, () => {
          counter.files--;
          countDown(counter);
        });
      } else {
        counter.files--;
        countDown(counter);
      }
    }
  });

  config.directories.forEach((directory) => {
    const folderName = getCurrentFolderName(directory.path);
    const newDest = `${tempDestination}${path.sep}${folderName}`;

    if (directory.save === true) {
      //move it
      FolderMover.copyFolder(directory.path, newDest, () => {
        console.log(`\t${folderName} and its content has been moved`);
        //then
        if (directory.delete === true && dryRun === false) {
          //delete it
          FolderMover.removeFolder(directory.path, () => {
            counter.directories--;
            countDown(counter);
          });
        } else {
          counter.directories--;
          countDown(counter);
        }
      });
    } else {
      if (directory.delete === true && dryRun === false) {
        //only delete it
        FolderMover.removeFolder(directory.path, () => {
          counter.directories--;
          countDown(counter);
        });
      } else {
        console.log(`${directory.path} won't be moved or deleted... Why?`);
        counter.directories--;
        countDown(counter);
      }
    }
  });

  function zipIt() {
    console.log('Zipping');
    return zip.ZipAFolder.zip(
      tempDestination,
      `${tempDestination}.zip`,
      (err) => {
        if (err) throw err;

        console.log('zipped');
      }
    );
  }

  function sendZip() {
    const dest = `${finalDestination}${path.sep}${getCurrentFolderName(
      tempDestination
    )}.zip`;
    console.log('sending archive to', dest);

    !dryRun &&
      FolderMover.removeFolder(tempDestination).then(() => {
        console.log('temp folder removed');
      });

    FileMover.copyFile(`${tempDestination}.zip`, dest).then(() => {
      console.log('zip file sended');

      !dryRun &&
        FileMover.removeFile(`${tempDestination}.zip`, () => {
          console.log('zip file removed from temp folder');
        });
    });
  }

  /**
   *
   * @param {{files: number, directories: number}} counter
   */
  function countDown(counter) {
    if (isCopied === true) return;

    if (counter.files === 0 && counter.directories === 0) {
      console.log(counter.files + counter.directories);
      isCopied = true;

      zipIt().then(sendZip);
    } else {
      console.log(counter.files + counter.directories);
    }
  }
}

exports.cpzs = cpzs;
