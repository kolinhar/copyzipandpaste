const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { getCurrentPathFromFilePath } = require('../../src/libs/utils');
const { FileMover } = require('../../src/libs/FileMover');

const filePathUnexistingFile = __dirname + path.sep + 'someUnexistingFile.nope';
const fileDestUnexistingFile =
  __dirname + `${path.sep}somewhere2${path.sep}someUnexistingFile.nope`;
const fileDestUnexistingFolderDestination = getCurrentPathFromFilePath(
  fileDestUnexistingFile
);

const fileDestExistingFile =
  __dirname + `${path.sep}somewhere${path.sep}test-copy.js`;

describe('FileMover.copyFile', function () {
  it('should reject promise file', () => {
    assert.rejects(
      FileMover.copyFile(filePathUnexistingFile, fileDestExistingFile),
      { name: 'Error', message: `file ${filePathUnexistingFile} doesn't exist` }
    );
  });

  it('should reject promise destination', () => {
    assert.rejects(FileMover.copyFile(__filename, fileDestUnexistingFile), {
      name: 'Error',
      message: `destination ${fileDestUnexistingFolderDestination} doesn't exist`,
    });
  });

  it('should copy a file', (done) => {
    assert
      .doesNotReject(FileMover.copyFile(__filename, fileDestExistingFile))
      .then(() => {
        fs.access(__filename, (err) => {
          if (err) {
            assert.fail('file not moved');
          } else {
            assert.ok(true);
          }
        });
      })
      .finally(done);
  });
});
