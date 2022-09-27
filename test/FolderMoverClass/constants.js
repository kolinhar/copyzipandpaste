const path = require('path');

const TEST_FOLDER_PATH_ORIG = `${__dirname}${path.sep}here`;
const TEST_FOLDER_PATH_DEST = `${__dirname}${path.sep}over_there`;
const HERE_FOLDER = `.${path.sep}here`;
const NEVER_FOLDER = `.${path.sep}never`;

exports.TEST_FOLDER_PATH_DEST = TEST_FOLDER_PATH_DEST;
exports.TEST_FOLDER_PATH_ORIG = TEST_FOLDER_PATH_ORIG;
exports.HERE_FOLDER = HERE_FOLDER;
exports.NEVER_FOLDER = NEVER_FOLDER;
