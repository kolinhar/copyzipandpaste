const path = require("path");

const {JsonWriter} = require("./libs/JsonWriter");
const {FileMover, FolderMover} = require("./libs/FileMover");
const {getCurrentFolderName} = require("./libs/utils");

const tempDestination = "D:\\Tests\\folder";
const finalDestination = "D:\\Tests\\folder2";

console.log("it works");

const config = JsonWriter.getConfig();

config.files.forEach(file => {
    const fileName = path.basename(file.path);
    const newDest = `${tempDestination}\\${fileName}`

    if (file.save === true) {
        //move file
        FileMover.moveFile(file.path, newDest)
            .addListener("close", () => {
                if (file.delete === true) {
                    //delete file
                    console.log(`\t${file.path} has been moved`);
                    removeFile(file.path, ()=>{});
                }
            })
    } else {
        if (file.delete === true) {
            //delete file
            removeFile(file.path, ()=>{});
        } else {
            console.log(`${file.path} won't be moved or deleted... Why?`);
        }
    }
});

config.directories.forEach(directory => {
    const folderName = getCurrentFolderName(directory.path);
    const newDest = `${tempDestination}${path.sep}${folderName}`

    if (directory.save === true) {
        //move it
        FolderMover.moveFolder(directory.path, newDest, ()=>{
            console.log(`\t${folderName} and its content has been moved`);
            //then
            if (directory.delete === true) {
                //delete it
                removeFolder(directory.path, ()=>{})
            }
        });
    } else {
        if (directory.delete === true) {
            //only delete it
            removeFolder(directory.path, ()=>{})
        } else {
            console.log(`${directory.path} won't be moved or deleted... Why?`);
        }
    }
});

/**
 *
 * @param {string} filePath
 * @param {Function?} cb
 */
function removeFile(filePath, cb) {
    FileMover.removeFile(filePath, ()=>{
        console.log(`\tfile ${filePath} deleted`);
        cb && cb();
    });
}

/**
 *
 * @param {string} folderPath
 * @param {Function?} cb
 */
function removeFolder(folderPath, cb){
    FolderMover.removeFolder(folderPath, ()=>{
        console.log(`\tfolder ${folderPath} deleted`);
        cb && cb();
    })
}
