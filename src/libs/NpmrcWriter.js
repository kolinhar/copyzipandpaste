'use strict';
const fs = require('fs');
const child_process = require('child_process');
const {
  absolutingPath,
  checkPathSync,
  formatJSONToNpmrc,
  formatStdout,
  formatStdoutFromJSONNmprc,
} = require('./utils');
const { DEFAULT_CONFIG } = require('../config/constants');

class NpmrcWriter {
  constructor() {
    if (new.target === NpmrcWriter) {
      throw new Error('Cannot instanciate class NpmrcWriter directly!');
    }
  }

  /**
   * add/update a path in the config file
   * @param {string} rawPath
   * @param {{save: boolean, deletion: boolean}} options
   * @param {boolean} [test]
   */
  static setNewPath(rawPath, options, test = false) {
    let absolutePath = absolutingPath(rawPath);

    if (fs.existsSync(absolutePath)) {
      const json = this.getConfig();
      const objectToAdd = {
        path: absolutePath,
        save: options.save,
        delete: options.deletion,
      };

      let objectType = fs.lstatSync(absolutePath).isDirectory()
        ? 'directories'
        : 'files';

      const pathArray = json[objectType].find(
        (val) => val.path === absolutePath
      );

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

      this._setConfig(json, test);
    } else {
      console.log("this path is not valid or doesn't exist");
    }
  }

  /**
   * add/update the backup folder
   * @param {string} rawPath
   * @param {boolean} [test]
   */
  static setBackupFolder(rawPath, test = false) {
    const absolutePath = absolutingPath(rawPath);

    if (checkPathSync(absolutePath)) {
      const config = this.getConfig();
      config.backupFolder = absolutePath;
      this._setConfig(config, test);
      console.log(`backup folder setted to ${absolutePath}`);
    } else {
      console.error(`cannot set backup folder to ${absolutePath}`);
    }
  }

  /**
   * return config in JSON
   * @returns {{
   *  backupFolder: string,
   *  files: {
   *    path: string,
   *    save: boolean,
   *    delete: boolean
   *  }[],
   *  directories: {
   *    path: string,
   *    save: boolean,
   *    delete: boolean
   *  }[]}}
   * @param {boolean} [test]
   */
  static getConfig(test = false) {
    const stdout = child_process.execSync(
      `npm config get cpzs:${test === true ? 'test' : 'config'}`,
      { encoding: 'utf8' }
    );

    const stdoutFormatted = formatStdout(stdout);

    if (stdoutFormatted === 'undefined') {
      // console.log(`no configuration found`);
      return DEFAULT_CONFIG;
    } else {
      // console.log(`config file found:`, stdoutFormatted);

      return formatStdoutFromJSONNmprc(stdoutFormatted);
    }
  }

  /**
   * set config from JSON
   * @param {{
   *  backupFolder: string,
   *  files: {
   *    path: string,
   *    save: boolean,
   *    delete: boolean
   *  }[],
   *  directories: {
   *    path: string,
   *    save: boolean,
   *    delete: boolean
   *  }[]}} json
   * @param {boolean} [test] testing mode
   */
  static _setConfig(json, test = false) {
    child_process.execSync(
      `npm config set cpzs:${
        test === true ? 'test' : 'config'
      } ${formatJSONToNpmrc(json)}`,
      { encoding: 'utf8' }
    );
  }

  /**
   * delete an existing path from the configuration
   * @param {string|number} rawPath
   * @param {boolean} [isFile]
   * @param {boolean} [test]
   */
  static delPath(rawPath, isFile, test = false) {
    const config = this.getConfig();
    let objectType = '';

    if (typeof rawPath === 'number') {
      objectType = isFile ? 'files' : 'directories';

      if (!config[objectType][rawPath]) {
        console.log(`path ${rawPath} doesn't exist`);
        return;
      }

      //filter on index
      config[objectType] = config[objectType].filter(
        (_val, ind) => ind !== rawPath
      );
    } else {
      const absolutePath = absolutingPath(rawPath);
      objectType = fs.lstatSync(absolutePath).isDirectory()
        ? 'directories'
        : 'files';

      if (
        !config[objectType].find((pathObj) => pathObj.path === absolutePath)
      ) {
        console.log(`path ${rawPath} doesn't exist`);
        return;
      }

      //filter on path
      config[objectType] = config[objectType].filter(
        (pathObj) => pathObj.path !== absolutePath
      );
    }

    this._setConfig(config, test);
    console.log(`path ${rawPath} removed from ${objectType}`);
  }
}

exports.NpmrcWriter = NpmrcWriter;
