const fs = require("fs");
const path = require("path");

class FileMover {
    constructor() {
        if (new.target === FileMover) {
            throw new Error("Cannot instanciate class FileMover directly!")
        }
    }

    static moveFile(file, destination) {
        return fs.createReadStream(file).pipe(fs.createWriteStream(destination));
    }

    static moveFolder(folderOrigin, destination) {
        console.log(`Folder ${folderOrigin} will be moved to ${destination}`);
        // create folder in destination
        fs.mkdir(destination, {recursive: true}, (err) => {
            if (err) {
                console.log("mkdir", err);
                return;
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
                        console.log("\tfolder to move", filePath);
                        // moveFolder for each folder
                        this.moveFolder(filePath, `${destination}\\${file}`);
                    } else {
                        console.log("\tfile to move", filePath);
                        const fileName = path.basename(filePath);
                        const newDest = `${destination}\\${fileName}`;
                        // move each file in new folder destination
                        this.moveFile(filePath, newDest)
                            .addListener("close", () => {
                                console.log(`file ${filePath} has been moved`);
                            });
                    }
                })
            });
        });
    }

    static removeFile(file) {
        fs.unlink(file, (err) => {
            if (err) {
                console.log(`file ${file} not deleted`, err);
            }
        });
    }
}

exports.FileMover = FileMover;
