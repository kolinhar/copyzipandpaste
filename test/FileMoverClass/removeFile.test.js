const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { FileMover } = require('../../src/libs/FileMover');

const filePathUnexisting = `${__dirname}${path.sep}someUnexistingFile.nope`;
const fileDestExisting = `${__dirname}${path.sep}test-copy.js`;

fs.writeFileSync(fileDestExisting, 'Blablablablabla');

describe('FileMover.removeFile', () => {
  it("should reject Promise because file doesn't exist", () => {
    assert.rejects(FileMover.removeFile(filePathUnexisting));
  });

  it('delete a file', () => {
    assert.doesNotReject(FileMover.removeFile(fileDestExisting));
  });

  it('check if file is really deleted', (done) => {
    fs.writeFileSync(fileDestExisting, 'Blablablablabla');

    FileMover.removeFile(fileDestExisting)
      .then(
        () => {
          fs.access(fileDestExisting, (err) => {
            if (err) {
              assert.ok(true);
            } else {
              assert.fail(`file ${fileDestExisting} not deleted`);
            }
          });
        },
        (err) => {
          assert.fail(err);
        }
      )
      .catch((err) => {
        assert.fail(err);
      })
      .finally(done);
  });

  it('try to delete an already deleted file', () => {
    assert.rejects(FileMover.removeFile(fileDestExisting));
  });
});
