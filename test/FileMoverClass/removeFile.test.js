const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { FileMover } = require('../../libs/FileMover');

const filePathUnexisting = `${__dirname}${path.sep}someUnexistingFile.nope`;

const fileDestExisting = `${__dirname}${path.sep}test-copy.js`;

fs.writeFileSync(fileDestExisting, 'Blablablablabla');

exports.removeFile = describe('FileMover.removeFile', () => {
  it("should reject Promise because file doesn't exist", () => {
    assert.rejects(FileMover.removeFile(filePathUnexisting), {
      message: `ENOENT: no such file or directory, unlink '${filePathUnexisting}'`,
    });
  });

  it('delete a file', (done) => {
    FileMover.removeFile(fileDestExisting)
      .then(() => {
        fs.access(fileDestExisting, (err) => {
          if (err) {
            assert.ok(true);
          } else {
            assert.fail(`file ${fileDestExisting} not deleted`);
          }
        });
      })
      .catch((err) => {
        assert.fail(err);
      })
      .finally(done);
  });
});
