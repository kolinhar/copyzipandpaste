const fs = require('fs');
const path = require('path');
const { constants } = require('path');
const { FolderMover } = require('../../src/libs/FileMover');

const TEST_FOLDER_PATH_ORIG = `.${path.sep}here`;
const TEST_FOLDER_PATH_DEST = `.${path.sep}over there`;

after(() => {
  fs.rmSync(TEST_FOLDER_PATH_ORIG, { recursive: true }, (err) => {
    if (err) {
      console.log(`error deleting ${TEST_FOLDER_PATH_ORIG}`, err);
    } else {
      console.log(`everything ok`);
    }
  });
  fs.rmSync(TEST_FOLDER_PATH_DEST, { recursive: true }, (err) => {
    if (err) {
      console.log(`error deleting ${TEST_FOLDER_PATH_DEST}`, err);
    } else {
      console.log(`everything ok`);
    }
  });
});

fs.mkdirSync(TEST_FOLDER_PATH_ORIG);
fs.writeFileSync(
  `${TEST_FOLDER_PATH_ORIG}${path.sep}test1.txt`,
  'blah blah blah'
);
fs.writeFileSync(
  `${TEST_FOLDER_PATH_ORIG}${path.sep}test2.txt`,
  'blah blah blah'
);
fs.writeFileSync(
  `${TEST_FOLDER_PATH_ORIG}${path.sep}test3.txt`,
  'blah blah blah'
);

describe('moveFolder method', (done) => {
  it('should move the folder and its files', () => {
    FolderMover.moveFolder(TEST_FOLDER_PATH_ORIG, TEST_FOLDER_PATH_DEST, () => {
      try {
        fs.accessSync(TEST_FOLDER_PATH_DEST, constants.R_OK | constants.W_OK);
      } catch (e) {
        console.log(`error`, e);
      }
    });
  });
});
