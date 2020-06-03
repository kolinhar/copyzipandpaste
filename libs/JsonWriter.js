"use strict";
const fs = require("fs");

const CONFIG_FILE_PATH = "./config/files.json";

class JsonWriter {
    constructor() {
        if (new.target === JsonWriter) {
            throw new Error("Cannot instanciate class JsonWriter directly!")
        }
    }

    static getConfig() {
        return JSON.parse(fs.readFileSync(CONFIG_FILE_PATH).toString());
    }

    /**
     *
     * @param {string} absolutePath
     * @param {{save: boolean, deletion: boolean}} options
     */
    static setNewPath(absolutePath, options) {
        if (fs.existsSync(absolutePath)) {
            console.log(options);
            const json = this.getConfig();

            const objectToAdd = {
                path: absolutePath,
                save: options.save,
                delete: options.deletion
            };

            if (fs.lstatSync(absolutePath).isDirectory()) {
                /*if (!json.directories.filter(val => val === absolutePath)){

                }*/

                json.directories.push(objectToAdd);
            } else {
                json.files.push(objectToAdd);
            }

            fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(json));
            console.log(`path ${absolutePath} added`);
        }
    }
}

exports.JsonWriter = JsonWriter;
