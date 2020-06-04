#! /usr/bin/env node
"use strict";

const {JsonWriter} = require("./libs/JsonWriter");
console.log("you are in CLI mode");
const {program} = require('commander');
program.version('0.0.1');

program.command("add <filePath>")
    .option("-s, --save", "save target", false)
    .option("-d, --deletion", "delete target", false)
    .description("add a file or folder to the config file")
    .action((filePath, options) => {
        console.log("add param filePath:", filePath, options.save, options.deletion);
        const {save, deletion} = options;
/*
        console.log(`process.cwd(): ${process.cwd()}`);
        console.log(`__dirname: ${__dirname}`);
        console.log(`__filename: ${__filename}`);
*/
        JsonWriter.setNewPath(filePath, {save, deletion});
    });

program.command("setWF <filePath>")
    .description("add or update the working folder where files and directories will be copied and zipped")
    .action((filePath)=>{
        JsonWriter.setCopyFolder(filePath);
    });

program.command("setBF <filePath>")
    .description("add or update the backup folder where zipped files and directories will be sent")
    .action((filePath)=>{
        JsonWriter.setBackupFolder(filePath);
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
