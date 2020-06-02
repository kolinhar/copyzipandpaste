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

    static setNewPath(absolutePath) {
        if (fs.existsSync(absolutePath)) {
            const json = this.getConfig();

            if (fs.lstatSync(absolutePath).isDirectory()) {
                /*if (!json.directories.filter(val => val === absolutePath)){

                }*/

                json.directories.push({
                    path: absolutePath,
                    save: true,
                    delete: true
                });
            } else {
                json.files.push({
                    path: absolutePath,
                    save: true,
                    delete: true
                });
            }
            
            fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(json));
            console.log(`path ${absolutePath} added`);
        }
    }
}

exports.JsonWriter = JsonWriter;
