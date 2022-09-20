const fs = require('fs');
const path = require('path');
const { FolderMover } = require('../../src/libs/FileMover');
const { TEST_FOLDER_PATH_DEST, TEST_FOLDER_PATH_ORIG } = require('./constants');

describe('copyFolder method', () => {
  it('should copy the folder and its files', (done) => {
    console.log('copy', TEST_FOLDER_PATH_ORIG, 'to', TEST_FOLDER_PATH_DEST);

    FolderMover.copyFolder(TEST_FOLDER_PATH_ORIG, TEST_FOLDER_PATH_DEST, () => {
      console.log(`LA`);

      try {
        console.log(`LA 2`);
        fs.accessSync(TEST_FOLDER_PATH_DEST);
        // origin folder and content must be copied
        fs.accessSync(TEST_FOLDER_PATH_ORIG);
        fs.accessSync(`${TEST_FOLDER_PATH_ORIG}${path.sep}test1.txt`);
        fs.accessSync(`${TEST_FOLDER_PATH_ORIG}${path.sep}test2.txt`);
        fs.accessSync(`${TEST_FOLDER_PATH_ORIG}${path.sep}test3.txt`);
        console.log(`ICI`);

        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
