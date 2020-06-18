#! /usr/bin/env node
"use strict";

const fs = require("fs");

const {program} = require('commander');
const {cpzs} = require("./index")
const {JsonWriter} = require("./libs/JsonWriter");

const myNumberReg = /^\d{1,4}$/;
program.version("1.0.4");

program.command("add <filePath>")
    .option("-s, --save", "save target", false)
    .option("-d, --deletion", "delete target", false)
    .description("add a file or folder to the config file")
    .action((filePath, options) => {
        const {save, deletion} = options;
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

            JsonWriter.delPath(parseInt(I, 10), F);
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
    .option("-n, --dry-run", "run without deletion to check if everything works fine", false)
    .description("do the job")
    .action((options) => {
        console.log("Let's the hack begin");
        cpzs(options.dryRun);
    });

program.parse(process.argv);
