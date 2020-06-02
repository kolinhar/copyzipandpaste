const path = require("path");

const {JsonWriter} = require("./libs/JsonWriter");
const {FileMover, FolderMover} = require("./libs/FileMover");
const {getCurrentFolderName} = require("./libs/utils");

const tempDestination = "D:\\Tests\\folder";
const finalDestination = "D:\\Tests\\folder2";

console.log("it works");

const config = JsonWriter.getConfig();

/*
config.files.forEach(file => {
    const fileName = path.basename(file.path);
    const newDest = `${tempDestination}\\${fileName}`

    if (file.save === true) {
        //move file
        FileMover.moveFile(file.path, newDest)
            .addListener("close", () => {
                if (file.delete === true) {
                    //delete file
                    console.log(`${file.path} has been moved, will be deleted`);
                    // FileMover.removeFile(file.path);
                } else {
                    console.log(`${file.path} won't be deleted`);
                }
            })
    } else {
        if (file.delete === true) {
            //delete file
            console.log(`${file.path} will be deleted`);
            // FileMover.removeFile(file.path);
        } else {
            console.log(`${file.path} won't be moved or deleted... Why?`);
        }
    }
});
*/

config.directories.forEach(directory => {
    const folderName = getCurrentFolderName(directory.path);
    const newDest = `${tempDestination}${path.sep}${folderName}`

    if (directory.save === true) {
        //move it
        FolderMover.moveFolder(directory.path, newDest)
        //then
        if (directory.delete === true) {
            //delete it
        }
    } else {
        if (directory.delete === true) {
            //only delete it
        } else {
            console.log(`${folderName} won't be moved or deleted... Why?`);
        }
    }
});
