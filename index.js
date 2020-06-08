"use strict";
const path = require("path");
const fs = require("fs");
const zip = require("zip-a-folder");

const {JsonWriter} = require("./libs/JsonWriter");
const {FileMover, FolderMover} = require("./libs/FileMover");
const {getCurrentFolderName, checkAbsolutePath} = require("./libs/utils");

console.log("it works");

function cpzs() {
    const config = JsonWriter.getConfig();

    const tempDestination = config.workingFolder;
    const finalDestination = config.backupFolder;

    let isCopied = false;

    const counter = {
        files: config.files.length,
        directories: config.directories.length,
    }

    try {
        checkAbsolutePath(tempDestination);
    } catch (e) {
        fs.mkdirSync(tempDestination, {recursive: true});
    }
    try {
        checkAbsolutePath(finalDestination);
    } catch (e) {
        fs.mkdirSync(finalDestination, {recursive: true});
    }

    config.files.forEach(file => {
        const fileName = path.basename(file.path);
        const newDest = `${tempDestination}\\${fileName}`

        if (file.save === true) {
            //move file
            FileMover.moveFile(file.path, newDest)
                .addListener("close", () => {
                    if (file.delete === true) {
                        //delete file
                        // console.log(`\t${file.path} has been moved`);
                        removeFile(file.path, () => {
                            counter.files--;
                            countDown(counter);
                        });
                    } else {
                        counter.files--;
                        countDown(counter);
                    }
                })
        } else {
            if (file.delete === true) {
                //delete file
                removeFile(file.path, () => {
                    counter.files--;
                    countDown(counter);
                });
            } else {
                // console.log(`${file.path} won't be moved or deleted... Why?`);
                counter.files--;
                countDown(counter);
            }
        }
    });

    config.directories.forEach(directory => {
        const folderName = getCurrentFolderName(directory.path);
        const newDest = `${tempDestination}${path.sep}${folderName}`

        if (directory.save === true) {
            //move it
            FolderMover.moveFolder(directory.path, newDest, () => {
                // console.log(`\t${folderName} and its content has been moved`);
                //then
                if (directory.delete === true) {
                    //delete it
                    removeFolder(directory.path, () => {
                        counter.directories--;
                        countDown(counter);
                    })
                } else {
                    counter.directories--;
                    countDown(counter);
                }
            });
        } else {
            if (directory.delete === true) {
                //only delete it
                removeFolder(directory.path, () => {
                    counter.directories--;
                    countDown(counter);
                })
            } else {
                console.log(`${directory.path} won't be moved or deleted... Why?`);
                counter.directories--;
                countDown(counter);
            }
        }
    });

    /**
     *
     * @param {string} filePath
     * @param {Function?} cb
     */
    function removeFile(filePath, cb) {
        FileMover.removeFile(filePath, () => {
            // console.log(`\tfile ${filePath} deleted`);
            cb && cb();
        });
    }

    /**
     *
     * @param {string} folderPath
     * @param {Function?} cb
     */
    function removeFolder(folderPath, cb) {
        FolderMover.removeFolder(folderPath, () => {
            // console.log(`\tfolder ${folderPath} deleted`);
            cb && cb();
        })
    }

    function zipIt() {
        console.log("ZIP");
        zip.zipFolder(tempDestination, `${tempDestination}.zip`, err => {
            if (err) throw err;

            console.log("zipped");
            sendZip();
        });
    }

    function sendZip() {
        const dest = `${finalDestination}${path.sep}${getCurrentFolderName(tempDestination)}.zip`;
        console.log("sending archive to", dest);

        FolderMover.removeFolder(tempDestination, () => {
            console.log("temp folder removed");
        });

        FileMover.moveFile(`${tempDestination}.zip`, dest).addListener("close", (path, cb) => {
            console.log("zip file sended");

            FileMover.removeFile(`${tempDestination}.zip`, () => {
                console.log("zip file removed");
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

            zipIt();
        } else {
            console.log(counter.files + counter.directories);
        }
    }
}

exports.cpzs = cpzs;
