"use strict";
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

exports.getCurrentFolderName = getCurrentFolderName;
exports.absolutingPath = absolutingPath;
