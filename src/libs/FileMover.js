'use strict';
const fs = require('fs');
const path = require('path');
const { getCurrentPathFromFilePath } = require('./utils');

class FileMover {
  constructor() {
    if (new.target === FileMover) {
      throw new Error('Cannot instanciate class FileMover directly!');
    }
  }

  /**
   * (async) move a file
   * @param {string} file
   * @param  {string} destination
   * @returns {Promise}
   */
  static copyFile(file, destination) {
    return new Promise((resolve, reject) => {
      const folderDest = getCurrentPathFromFilePath(destination);

      if (folderDest) {
        fs.access(file, (err) => {
          if (err) {
            reject(new Error(`file ${file} doesn't exist`));
          } else {
            fs.access(folderDest, (err) => {
              if (err) {
                reject(new Error(`destination ${folderDest} doesn't exist`));
              } else {
                fs.createReadStream(file)
                  .pipe(fs.createWriteStream(destination))
                  .addListener('error', (err) => {
                    reject(err);
                  })
                  .addListener('close', () => {
                    resolve();
                  });
              }
            });
          }
        });
      } else {
        throw `path ${destination} invalid`;
      }
    });
  }

  /**
   * (async) delete a file
   * @param {string} file
   * @returns {Promise}
   */
  static removeFile(file) {
    return new Promise((resolve, reject) => {
      fs.unlink(file, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

class FolderMover extends FileMover {
  constructor() {
    if (new.target === FolderMover) {
      throw new Error('Cannot instanciate class FolderMover directly!');
    }
    // only to stop the alerts
    super();
  }

  /**
   * move a folder and its content
   * @param {string} folderOrigin
   * @param {string} destination
   * @param {Function} [cb]
   */
  static copyFolder(folderOrigin, destination, cb) {
    //folderOrigin will be moved to destination
    // create folder in destination
    fs.mkdir(destination, { recursive: true }, (err) => {
      if (err) throw err;

      // read origin folder content
      fs.readdir(folderOrigin, (err, files) => {
        if (err) throw err;

        let filesCounter = files.length;

        // if it's an empty folder call the callback
        if (filesCounter === 0) {
          cb && cb();
        }

        files.forEach((file) => {
          const filePath = `${folderOrigin}${path.sep}${file}`;

          // check if filePath is a directory or file
          if (fs.lstatSync(filePath).isDirectory() === true) {
            // moveFolder for each folder
            this.copyFolder(
              filePath,
              `${destination}${path.sep}${file}`,
              () => {
                filesCounter--;

                if (filesCounter === 0) {
                  cb && cb();
                }
              }
            );
          } else {
            const fileName = path.basename(filePath);
            const newDest = `${destination}\\${fileName}`;
            // move each file in new folder destination
            this.copyFile(filePath, newDest).then(() => {
              filesCounter--;

              if (filesCounter === 0) {
                cb && cb();
              }
            });
          }
        });
      });
    });

    fs.rename(folderOrigin, destination, cb);
  }

  /**
   * remove a folder and its content
   * @param {string} path
   * @param {Function} [cb]
   */
  static removeFolder(path, cb) {
    fs.rm(path, { recursive: true }, (err) => {
      if (err) {
        console.log(`folder ${path} not deleted`);
      }

      cb && cb();
    });
  }
}

exports.FileMover = FileMover;
exports.FolderMover = FolderMover;