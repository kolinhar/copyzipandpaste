'use strict';
const fs = require('fs');
const path = require('path');
// @TODO: why the fuck I need to import like this ?
const JsonWriter = require('./JsonWriter');

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

function getConfigFromJSON() {
  // @TODO: and why the fuck I had to use it like that to make it fucking works properly ?
  const config = JsonWriter.JsonWriter.getConfig();
  console.table({
    'Working Folder': config.workingFolder,
    'Backup Folder': config.backupFolder,
  });
  console.log('\nFiles');
  console.table(config.files);
  console.log('\nDirectories');
  console.table(config.directories);

  // @TODO: check if there is a backup folder and if it exists
}

exports.getCurrentFolderName = getCurrentFolderName;
exports.absolutingPath = absolutingPath;
exports.checkPath = checkPath;
exports.checkPathSync = checkPathSync;
exports.getCurrentPathFromFilePath = getCurrentPathFromFilePath;
exports.getConfigFromJSON = getConfigFromJSON;
