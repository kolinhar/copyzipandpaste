const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { FolderMover } = require('../../src/libs/FileMover');
const { TEST_FOLDER_PATH_DEST, TEST_FOLDER_PATH_ORIG } = require('./constants');

describe('copyFolder method', () => {
  it('should copy the folder and its files', (done) => {
    FolderMover.copyFolder(TEST_FOLDER_PATH_ORIG, TEST_FOLDER_PATH_DEST).then(
      () => {
        try {
          fs.accessSync(TEST_FOLDER_PATH_DEST);
          // origin folder and content must be copied
          fs.accessSync(TEST_FOLDER_PATH_ORIG);
          fs.accessSync(`${TEST_FOLDER_PATH_ORIG}${path.sep}test1.txt`);
          fs.accessSync(`${TEST_FOLDER_PATH_ORIG}${path.sep}test2.txt`);
          fs.accessSync(`${TEST_FOLDER_PATH_ORIG}${path.sep}test3.txt`);
          done();
        } catch (e) {
          done(e);
        }
      },
      done
    );
  });

  it('should fail', () => {
    assert.rejects(FolderMover.copyFolder('./here', './never'));
  });
});
