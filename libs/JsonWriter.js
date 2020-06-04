"use strict";
const fs = require("fs");
const path = require("path");

const {absolutingPath, checkAbsolutePath} = require("./utils");

const CONFIG_FILE_PATH = `${__dirname}\\..\\config\\files.json`;

class JsonWriter {
    constructor() {
        if (new.target === JsonWriter) {
            throw new Error("Cannot instanciate class JsonWriter directly!")
        }
    }

    /**
     * return config file in JSON
     * @returns {{workingFolder: string, backupFolder: string, files: {path: string, save: boolean, delete: boolean}[], directories: {path: string, save: boolean, delete: boolean}[]}}
     */
    static getConfig() {
        return JSON.parse(fs.readFileSync(CONFIG_FILE_PATH).toString());
    }

    /**
     * add/update a path in the config file
     * @param {string} rawPath
     * @param {{save: boolean, deletion: boolean}} options
     */
    static setNewPath(rawPath, options) {
        let absolutePath = absolutingPath(rawPath);

        if (fs.existsSync(absolutePath)) {
            const json = this.getConfig();
            const objectToAdd = {
                path: absolutePath,
                save: options.save,
                delete: options.deletion
            };

            let objectType = (fs.lstatSync(absolutePath).isDirectory() ? "directories" : "files");

            const pathArray = json[objectType].find(val => val.path === absolutePath);

            if (pathArray !== undefined) {
                //if this path already exists update it
                pathArray.save = options.save;
                pathArray.delete = options.deletion;
                console.log(`path ${absolutePath} updated`);
            } else {
                //or add it
                json[objectType].push(objectToAdd);
                console.log(`path ${absolutePath} added to ${objectType}`);
            }

            fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(json));
        } else {
            console.log("this path is not valid or doesn't exist");
        }
    }

    /**
     * add/update the copy/zip folder
     * @param {string} rawPath
     */
    static setCopyFolder(rawPath) {
        const absolutePath = absolutingPath(rawPath);
        checkAbsolutePath(absolutePath);

        const config = this.getConfig();
        config.workingFolder = absolutePath;
        fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config));
        console.log(`working folder setted to ${absolutePath}`);
    }

    /**
     * add/update the backup folder
     * @param {string} rawPath
     */
    static setBackupFolder(rawPath) {
        const absolutePath = absolutingPath(rawPath);
        checkAbsolutePath(absolutePath);

        const config = this.getConfig();
        config.backupFolder = absolutePath;
        fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config));
        console.log(`backup folder setted to ${absolutePath}`);
    }
}

exports.JsonWriter = JsonWriter;
