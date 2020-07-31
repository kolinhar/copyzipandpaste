"use strict";
const fs = require("fs");
const path = require("path");
const {getCurrentFolderNameFromFilePath} = require("./utils");

class FileMover {
    constructor() {
        if (new.target === FileMover) {
            throw new Error("Cannot instanciate class FileMover directly!")
        }
    }

    /**
     * (async) move a file
     * @param {string} file
     * @param  {string} destination
     * @returns {Promise}
     */
    static moveFile(file, destination) {
        return new Promise((resolve, reject) => {
            const folderDest = getCurrentFolderNameFromFilePath(destination);

            // console.log(`folderDest: ${folderDest}`);

            fs.access(file, err => {
                if (err) {
                    reject(new Error(`file ${file} doesn't exist`));
                } else {
                    fs.access(folderDest, err => {
                        if (err) {
                            reject(new Error(`destination ${folderDest} doesn't exist`));
                        } else {
                            fs.createReadStream(file)
                                .pipe(fs.createWriteStream(destination))
                                .addListener("error", (err) => {
                                    reject(err);
                                })
                                .addListener("close", () => {
                                    resolve();
                                });
                        }
                    });
                }
            });
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
            throw new Error("Cannot instanciate class FolderMover directly!")
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
    static moveFolder(folderOrigin, destination, cb) {
        //folderOrigin will be moved to destination
        // create folder in destination
        fs.mkdir(destination, {recursive: true}, (err) => {
            if (err) throw err;

            // read origin folder content
            fs.readdir(folderOrigin, (err, files) => {
                if (err) throw err;

                let filesCounter = files.length

                // if it's an empty folder call the callback
                if (filesCounter === 0) {
                    cb && cb();
                }

                files.forEach(file => {
                    const filePath = `${folderOrigin}\\${file}`;

                    // check if filePath is a directory or file
                    if (fs.lstatSync(filePath).isDirectory() === true) {
                        // moveFolder for each folder
                        this.moveFolder(filePath, `${destination}\\${file}`, () => {
                            filesCounter--;

                            if (filesCounter === 0) {
                                cb && cb();
                            }
                        });
                    } else {
                        const fileName = path.basename(filePath);
                        const newDest = `${destination}\\${fileName}`;
                        // move each file in new folder destination
                        this.moveFile(filePath, newDest)
                            .addListener("close", () => {
                                filesCounter--;

                                if (filesCounter === 0) {
                                    cb && cb();
                                }
                            });
                    }
                })
            });
        });
    }

    /**
     * remove a folder and its content
     * @param {string} path
     * @param {Function} [cb]
     */
    static removeFolder(path, cb) {
        fs.rmdir(path, {recursive: true}, (err) => {
            if (err) {
                console.log(`folder ${path} not deleted`);
                // throw err;
            }

            cb && cb();
        });
    }
}

exports.FileMover = FileMover;
exports.FolderMover = FolderMover;
