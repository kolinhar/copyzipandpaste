const path = require("path");

function getCurrentFolderName(folderPath) {
    const folderPathSplited = folderPath.split(path.sep);
    return folderPathSplited[folderPathSplited.length - 1];
}

exports.getCurrentFolderName = getCurrentFolderName;
