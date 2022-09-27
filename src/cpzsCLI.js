#! /usr/bin/env node
'use strict';

// don't forget npm i and npm link before dev ;-)

const { program } = require('commander');
const { cpzs } = require('../index');
const { NpmrcWriter } = require('./libs/NpmrcWriter');
const { getConfigFromJSON } = require('./libs/utils');

const myNumberReg = /^\d{1,4}$/;
program.version('1.2.11');

program
  .command('add <filePath>')
  .option('-s, --save', 'save target', false)
  .option('-d, --deletion', 'delete target', false)
  .description('add a file or folder to the config file')
  .action((filePath, options) => {
    const { save, deletion } = options;
    NpmrcWriter.setNewPath(filePath, { save, deletion });
  });

program
  .command('setBF <filePath>')
  .description(
    'add or update the backup folder where zipped files and directories will be sent'
  )
  .action((filePath) => {
    NpmrcWriter.setBackupFolder(filePath);
  });

program
  .command('remove [filePath]')
  .option('-i <index>', 'index to delete', '-1')
  .option('-f', "it's a file", false)
  .description('remove a file or folder to the config file')
  .action((filePath, options) => {
    /*
     * if [filepath] is given, it will be checked if it's a file or directory
     * if <index> is given, -f could be given if it's a file, if not it's a directory
     */
    // console.log("remove param filePath:", filePath);
    if (filePath !== undefined) {
      NpmrcWriter.delPath(filePath);
    } else {
      const { i, f } = options;

      if (myNumberReg.test(i) === false) {
        console.log(`invalid index ${i}, it must be between 0 and 9999`);
        return;
      }

      NpmrcWriter.delPath(parseInt(i, 10), f);
    }
  });

program
  .command('config')
  .description('get the all the config')
  .action(() => {
    getConfigFromJSON(NpmrcWriter.getConfig());
  });

program
  .command('go')
  .option(
    '-n, --dry-run',
    'run without deletion to check if everything works fine',
    false
  )
  .description('do the job')
  .action((options) => {
    console.log("Let's the hack begin !");
    cpzs(options.dryRun);
  });

program.parse(process.argv);
