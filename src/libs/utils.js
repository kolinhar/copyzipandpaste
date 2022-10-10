'use strict';
const fs = require('fs');
const path = require('path');

/**
 * get the last directory of a directory path
 * eg: C:\Users\root\copyzipandpaste --> copyzipandpaste
 * @param {string} folderPath
 * @returns {boolean|string}
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
 * @returns {boolean|string}
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
  console.log(`1 absolutingPath ==> rawPath:`, rawPath);

  if (rawPath.charAt(rawPath.length - 1) === path.sep) {
    rawPath = rawPath.slice(0, -1);
  }

  console.log(`2 absolutingPath ==> rawPath:`, rawPath);

  if (path.isAbsolute(rawPath) === false) {
    const newPath = path.join(process.cwd(), path.normalize(rawPath));
    console.log(`3 absolutingPath ==> rawPath:`, newPath);
    return path.join(newPath);
  }

  const newPath = path.normalize(rawPath);
  console.log(`4 absolutingPath ==> rawPath:`, newPath);
  return newPath;
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
 * check if an absolute path exists
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
 * displays configuration in console
 * @param {import('./NpmrcWriter').configObj}
 */
function getConfigFromJSON({ files, directories, backupFolder }) {
  console.table({
    'Backup Folder': backupFolder,
  });
  console.log('\nFiles');
  console.table(files);
  console.log('\nDirectories');
  console.table(directories);

  if (!backupFolder) {
    console.warn(
      "Be careful, there is no backup folder !\nDon't forget to add one."
    );
  }
}

/**
 * format stdout because it always return a breaking line from command line
 * @param {string} stdout
 * @returns {string}
 */
const formatStdout = (stdout) => stdout.slice(0, -1);

/**
 * format stdout from a JSON variable stored in npmrc
 * @param {string} stdout
 * @returns {Object}
 */
const formatStdoutFromJSONNmprc = (stdout) => {
  console.log(`raw input\n`, stdout);

  stdout = stdout.slice(0, -1).slice(1);
  console.log(`\ntry to convert:\n`, stdout);

  return JSON.parse(stdout);
};

/* @TODO: quand on passe par formatJSONToNpmrc et que backupFolder vaut "E:\\\\\"
 * si on passe par formatStdoutFromJSONNmprc, backupFolder vaudra "E:\\\" et ça plante le JSON.parse()
 * de plus, l'affichage de la config dans la console affiche 'E:\\'
 */

/**
 * format JSON to string storable in npmrc file
 * @param {Object} json
 * @returns {string}
 */
const formatJSONToNpmrc = (json) => {
  console.log(`\njson\n`, json);

  const jsonStr = JSON.stringify(json);
  console.log(`\njsonStr\n`, jsonStr);

  const jsonStrReplaced = `"${jsonStr}"`.replaceAll('"', '\\"');
  console.log(`\njsonStrReplaced\n`, jsonStrReplaced);

  return '"' + jsonStrReplaced + '"';
};

/**
 * add a '0' if num is lower than 10
 * @param {number} num
 * @returns
 */
const m10 = (num) => {
  return num > 9 ? '' + num : `0${num}`;
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
exports.m10 = m10;
