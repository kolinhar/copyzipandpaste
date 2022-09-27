'use strict';
const fs = require('fs');
const path = require('path');

/**
 * get the last directory of a directory path
 * eg: C:\Users\root\copyzipandpaste --> copyzipandpaste
 * @param {string} folderPath
 * @returns {*|string}
 */
function getCurrentFolderName(folderPath) {
  if (path.isAbsolute(folderPath) === false) {
    //@TODO: refactor
    return false;
  } else {
    const folderPathSplited = folderPath.split(path.sep);
    return folderPathSplited[folderPathSplited.length - 1];
  }
}

/**
 * get the absolute path directory from an absolute file path
 * eg: C:\Users\root\copyzipandpaste\test\utils.js --> C:\Users\root\copyzipandpaste\test
 * @param {string} filePath
 * @returns {*|string}
 */
function getCurrentPathFromFilePath(filePath) {
  if (path.isAbsolute(filePath) === false) {
    //@TODO: refactor
    return false;
  } else {
    const filePathSplited = filePath.split(path.sep);
    filePathSplited.pop();
    return filePathSplited.join(path.sep);
  }
}

/**
 * normalizes path and makes it absolute
 * @param {string} rawPath
 * @returns {string}
 */
function absolutingPath(rawPath) {
  if (path.isAbsolute(rawPath) === false) {
    return path.join(process.cwd(), path.normalize(rawPath));
  }
  return path.normalize(rawPath);
}

/**
 * check if a path exists
 * @param {string} absolutePath
 * @returns {Promise}
 */
function checkPath(absolutePath) {
  return new Promise((resolve, reject) => {
    fs.access(absolutePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 *
 * @param {string} absolutePath
 * @returns {boolean}
 */
function checkPathSync(absolutePath) {
  try {
    fs.accessSync(absolutePath);
    return true;
  } catch (_e) {
    return false;
  }
}

/**
 *
 * @param {Object} config
 */
function getConfigFromJSON(config) {
  // @TODO: and why the fuck I had to use it like that to make it fucking works properly ?
  console.table({
    'Backup Folder': config.backupFolder,
  });
  console.log('\nFiles');
  console.table(config.files);
  console.log('\nDirectories');
  console.table(config.directories);

  // @TODO: check if there is a backup folder and if it exists

  if (!config.backupFolder) {
    console.warn(
      "Be careful, there is no backup folder !\nDon't forget to add one."
    );
  }
}

/**
 * format stdout output because it always return a breaking line from command line
 * @param {string} stdout
 * @returns {string}
 */
const formatStdout = (stdout) => stdout.slice(0, -1);

/**
 * format stdout from a JSON variable stored in npmrc
 * @param {string} stdout
 * @returns {Object}
 */
const formatStdoutFromJSONNmprc = (stdout) =>
  JSON.parse(stdout.slice(0, -1).slice(1));

/**
 * format JSON to string storable in npmrc file
 * @param {Object} Json
 * @returns {string}
 */
const formatJSONToNpmrc = (Json) => {
  return '"' + `"${JSON.stringify(Json)}"`.replaceAll('"', `\\"`) + '"';
};

exports.getCurrentFolderName = getCurrentFolderName;
exports.absolutingPath = absolutingPath;
exports.checkPath = checkPath;
exports.checkPathSync = checkPathSync;
exports.getCurrentPathFromFilePath = getCurrentPathFromFilePath;
exports.getConfigFromJSON = getConfigFromJSON;
exports.formatStdout = formatStdout;
exports.formatStdoutFromJSONNmprc = formatStdoutFromJSONNmprc;
exports.formatJSONToNpmrc = formatJSONToNpmrc;
