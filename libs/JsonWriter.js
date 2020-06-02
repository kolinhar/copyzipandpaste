"use strict";
const fs = require("fs");

class JsonWriter {
    constructor() {
        if (new.target === JsonWriter) {
            throw new Error("Cannot instanciate class JsonWriter directly!")
        }
    }

    static getConfig() {
        return JSON.parse(fs.readFileSync("./config/files.json").toString());
    }
}

exports.JsonWriter = JsonWriter;
