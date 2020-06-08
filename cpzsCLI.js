#! /usr/bin/env node
"use strict";

const fs = require("fs");

const {program} = require('commander');
const {cpzs} = require("./index")
const {JsonWriter} = require("./libs/JsonWriter");

const myNumberReg = /^\d{1,4}$/;
program.version("1.0.2");

program.command("add <filePath>")
    .option("-s, --save", "save target", false)
    .option("-d, --deletion", "delete target", false)
    .description("add a file or folder to the config file")
    .action((filePath, options) => {
        // console.log("add param filePath:", filePath, options.save, options.deletion);
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
    .action((filePath) => {
        JsonWriter.setCopyFolder(filePath);
    });

program.command("setBF <filePath>")
    .description("add or update the backup folder where zipped files and directories will be sent")
    .action((filePath) => {
        JsonWriter.setBackupFolder(filePath);
    });

program.command("remove [filePath]")
    .option("-i <index>", "index to delete", "-1")
    .option("-f", "it's a file", false)
    .description("remove a file or folder to the config file")
    .action((filePath, options) => {
        /*
        * if [filepath] is given, it will be checked if it's a file or directory
        * if <index> is given, -f could be given if it's a file, if not it's a directory
        */
        // console.log("remove param filePath:", filePath);
        if (filePath !== undefined) {
            JsonWriter.delPath(filePath);
        } else {
            const {I, F} = options;

            if (myNumberReg.test(I) === false) throw "invalid index, must be between 0 and 9999";

            const newOptions = {
                isFile: F
            }

            JsonWriter.delPath(parseInt(I, 10), newOptions);
        }
    });

program.command("getConfig")
    .description("get the all the config")
    .action(() => {
        const config = JsonWriter.getConfig();
        console.table({
            "Working folder": config.workingFolder,
            "Backup Folder": config.backupFolder
        });
        console.log("\nFiles");
        console.table(config.files);
        console.log("\nDirectories");
        console.table(config.directories);
    });

program.command("go")
    .description("do the job")
    .action(() => {
        //@TODO
        console.log("Let's the hack begin");
        cpzs();
    });

program.parse(process.argv);
