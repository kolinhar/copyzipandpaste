const fs = require("fs");
const path = require("path");

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
     * @returns {WriteStream}
     */
    static moveFile(file, destination) {
        return fs.createReadStream(file).pipe(fs.createWriteStream(destination));
    }

    /**
     * (async) delete a file
     * @param {string} file
     * @param {Function?} cb
     */
    static removeFile(file, cb) {
        fs.unlink(file, (err) => {
            if (err) {
                console.log(`file ${file} not deleted`, err);
                return;
            }
            cb && cb();
        });
    }
}

class FolderMover extends FileMover{
    constructor() {
        if (new.target === FolderMover) {
            throw new Error("Cannot instanciate class FolderMover directly!")
        }
        super();
    }

    /**
     * move a folder and its content
     * @param {string} folderOrigin
     * @param {string} destination
     */
    static moveFolder(folderOrigin, destination) {
        console.log(`Folder ${folderOrigin} will be moved to ${destination}`);
        // create folder in destination
        fs.mkdir(destination, {recursive: true}, (err) => {
            if (err) {
                throw err;
            }
            console.log(`folder ${destination} created`);
            // read folder content
            fs.readdir(folderOrigin, (err, files) => {
                if (err) {
                    throw err;
                }

                files.forEach(file => {
                    const filePath = `${folderOrigin}\\${file}`;

                    console.log(`check if ${filePath} is a directory or file`);
                    if (fs.lstatSync(filePath).isDirectory() === true) {
                        // console.log("\tfolder to move", filePath);
                        // moveFolder for each folder
                        this.moveFolder(filePath, `${destination}\\${file}`);
                    } else {
                        // console.log("\tfile to move", filePath);
                        const fileName = path.basename(filePath);
                        const newDest = `${destination}\\${fileName}`;
                        // move each file in new folder destination
                        this.moveFile(filePath, newDest)
                        /*.addListener("close", () => {
                            console.log(`file ${filePath} has been moved`);
                        })*/;
                    }
                })
            });
        });
    }

    /**
     *
     * @param {string} path
     * @param {Function?} cb
     */
    static removeFolder (path, cb){
        //@TODO
    }
}

exports.FileMover = FileMover;
exports.FolderMover = FolderMover;
