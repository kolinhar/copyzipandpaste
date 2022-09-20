const path = require('path');
const fs = require('fs');
const { TEST_FOLDER_PATH_DEST, TEST_FOLDER_PATH_ORIG } = require('./constants');

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
  fs.rmSync(TEST_FOLDER_PATH_DEST, { recursive: true }, (err) => {
    if (err) {
      console.log(`error deleting ${TEST_FOLDER_PATH_DEST}`, err);
    } else {
      console.log(`everything ok`);
    }
  });
});

require('./copyFolder.test');
require('./removeFolder.test');
