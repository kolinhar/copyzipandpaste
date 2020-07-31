const assert = require('assert');
/*const fs = require("fs");
const path = require("path");
const {getCurrentFolderNameFromFilePath} = require("../libs/utils");
const {FileMover} = require("../libs/FileMover");


const filePathUnexistingFile = __dirname + path.sep + "someUnexistingFile.nope";
const fileDestUnexistingFile = __dirname + `${path.sep}somewhere2${path.sep}someUnexistingFile.nope`;
const fileDestUnexistingFolderDestination = getCurrentFolderNameFromFilePath(fileDestUnexistingFile);


const fileDestExistingFile = __dirname + `${path.sep}somewhere${path.sep}test-copy.js`;*/

describe('FileMover class', function () {
/*    describe("#try to move a file", () => {
        it("should reject promise file", () => {
            assert.rejects(FileMover.moveFile(filePathUnexistingFile, fileDestExistingFile),
                {name: 'Error', message: `file ${filePathUnexistingFile} doesn't exist`});
        });

        it("should reject promise destination", () => {
            assert.rejects(FileMover.moveFile(__filename, fileDestUnexistingFile),
                {name: 'Error', message: `destination ${fileDestUnexistingFolderDestination} doesn't exist`});
        });

        it("should move a file", done => {
            assert.doesNotReject(FileMover.moveFile(__filename, fileDestExistingFile))
                .then(() => {
                    fs.access(__filename, err => {
                        if (err) {
                            assert.fail("file not moved");
                        } else {
                            assert.ok(true);
                        }
                    });
                })
                .finally(done);
        });
    });

    describe("#try to delete a file", () => {
        it("should throw error", () => {
            assert.rejects(FileMover.removeFile(filePathUnexistingFile),
                {message: `ENOENT: no such file or directory, unlink '${filePathUnexistingFile}'`});
        });

        it("should do it", (done) => {
            FileMover.removeFile(fileDestExistingFile)
                .then(() => {
                    fs.access(fileDestExistingFile, err => {
                        if (err) {
                            assert.ok(true);
                        } else {
                            assert.fail(`file ${fileDestExistingFile} not deleted`);
                        }
                    });
                })
                .catch((err) => {
                    assert.fail(err);
                })
                .finally(done);
        });
    });*/
    require("./FileMoverClass/index");
});