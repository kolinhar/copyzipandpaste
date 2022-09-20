const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { FolderMover } = require('../../src/libs/FileMover');
const { TEST_FOLDER_PATH_ORIG } = require('./constants');

describe('removeFolder method', () => {
  it('remove a folder and its content', (done) => {
    FolderMover.removeFolder(TEST_FOLDER_PATH_ORIG).then(() => {
      fs.access(TEST_FOLDER_PATH_ORIG, (err) => {
        if (err) {
          done();
        } else {
          done('folder not deleted');
        }
      });
    }, done);
  });

  it('should fail with an inexisting path', () => {
    assert.rejects(FolderMover.removeFolder(`.${path.sep}false`));
  });
});
