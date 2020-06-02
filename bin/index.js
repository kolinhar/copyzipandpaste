#! /usr/bin/env node
"use strict";

const {JsonWriter} = require("../libs/JsonWriter");
console.log("you are in CLI mode");
const {program} = require('commander');
program.version('0.0.1');


program.command("add <filePath>")
    .description("add a file or folder to the config file")
    .action((filePath) => {
        console.log("add param filePath:", filePath);
        JsonWriter.setNewPath(filePath);
    });

program.command("remove <filePath>")
    .description("remove a file or folder to the config file")
    .action((filePath) => {
        console.log("remove param filePath:", filePath);
    });

program.command("cpzs")
    .description("do its job")
    .action(() => {
        console.log("Let's the hack begin");
    });

program.parse(process.argv);
