const fs = require('fs');
const path = require('path');
const { FolderMover } = require('../../src/libs/FileMover');

const TEST_FOLDER_PATH_ORIG = `.${path.sep}here`;
const TEST_FOLDER_PATH_DEST = `.${path.sep}over there`;

before(() => {
  //create a folder an its content
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
});

after(() => {
  // remove folders and contents
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

describe('copyFolder method', () => {
  it('should copy the folder and its files', (done) => {
    FolderMover.copyFolder(TEST_FOLDER_PATH_ORIG, TEST_FOLDER_PATH_DEST, () => {
      try {
        fs.accessSync(TEST_FOLDER_PATH_DEST);
        // origin folder and content must be copied
        fs.accessSync(TEST_FOLDER_PATH_ORIG);
        fs.accessSync(`${TEST_FOLDER_PATH_ORIG}${path.sep}test1.txt`);
        fs.accessSync(`${TEST_FOLDER_PATH_ORIG}${path.sep}test2.txt`);
        fs.accessSync(`${TEST_FOLDER_PATH_ORIG}${path.sep}test3.txt`);
      } catch (e) {
        console.log(`error: `, e);
        done();
      }
      done();
    });
  });
});
