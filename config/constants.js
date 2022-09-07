const path = require('path');

const configFileName = `files.json`;

const CONFIG_FILE_PATH = path.resolve(
  `${__dirname}${path.sep}..${path.sep}config${path.sep}${configFileName}`
);

const DEFAULT_CONFIG = {
  files: [],
  directories: [],
  workingFolder: '',
  backupFolder: '',
};

exports.CONFIG_FILE_PATH = CONFIG_FILE_PATH;
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
