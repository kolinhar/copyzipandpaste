const assert = require('assert');
const fs = require("fs");
const path = require("path");
const {FileMover} = require("../../libs/FileMover");


const filePathUnexistingFile = __dirname + path.sep + "someUnexistingFile.nope";

const fileDestExistingFile = __dirname + `${path.sep}somewhere${path.sep}test-copy.js`;

exports.removeFile = describe('FileMover.removeFile', function () {
    it("should reject Promise", () => {
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
});