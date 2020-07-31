"use strict";
const fs = require("fs");

const path = require("path");

/**
 * get the last directory of a path
 * @param {string} folderPath
 * @returns {*|string}
 */
function getCurrentFolderName(folderPath) {
    const folderPathSplited = folderPath.split(path.sep);
    return folderPathSplited[folderPathSplited.length - 1];
}
/**
 * get the last directory of a path
 * @param {string} filePath
 * @returns {*|string}
 */
function getCurrentFolderNameFromFilePath(filePath) {
    const filePathSplited = filePath.split(path.sep);
    filePathSplited.pop();
    return filePathSplited.join(path.sep);
}

/**
 * normalizes path and makes it absolute
 * @param {string} rawPath
 * @returns {string}
 */
function absolutingPath(rawPath) {
    if (path.isAbsolute(rawPath) === false) {
        console.log("not absolute");
        return path.join(process.cwd(), path.normalize(rawPath));
    }
    return path.normalize(rawPath);
}

/**
 * check if a path exists
 * @param {string} absolutePath
 */
function checkAbsolutePath(absolutePath) {
    if (!fs.existsSync(absolutePath)) {
        throw "this path is not valid or doesn't exist";
    }
}

exports.getCurrentFolderName = getCurrentFolderName;
exports.absolutingPath = absolutingPath;
exports.checkAbsolutePath = checkAbsolutePath;
exports.getCurrentFolderNameFromFilePath = getCurrentFolderNameFromFilePath;