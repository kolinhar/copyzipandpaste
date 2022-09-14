'use strict';
const fs = require('fs');
const { absolutingPath, checkPathSync } = require('./utils');

// @TODO: put in a configuration file in ./config in order to get the CONFIG_FILE_PATH
/*
  do something like this:
  create a js file and just write in it 'exports.CONFIG_FILE_PATH = [insert the right path here]'
  then import it to avoid fs.readFileSync() each time
  or find something better
*/
const { CONFIG_FILE_PATH } = require('../config/constants');

class JsonWriter {
  constructor() {
    if (new.target === JsonWriter) {
      throw new Error('Cannot instanciate class JsonWriter directly!');
    }
  }

  static CONFIG_FILE_PATH_INTERNAL = CONFIG_FILE_PATH;

  /**
   * set the configuration path file
   * @param {string} filePath
   */
  static setConfigFilePath(filePath) {
    const absolutedPath = absolutingPath(filePath);
    if (checkPathSync(absolutedPath)) {
      this.CONFIG_FILE_PATH_INTERNAL = filePath;
      console.log(`config file path updated to ${absolutedPath}`);
    } else {
      console.error(`cannot set working folder to ${absolutedPath}`);
    }
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

      fs.writeFileSync(this.CONFIG_FILE_PATH_INTERNAL, JSON.stringify(json));
    } else {
      console.log("this path is not valid or doesn't exist");
    }
  }

  /**
   * add/update the backup folder
   * @param {string} rawPath
   */
  static setBackupFolder(rawPath) {
    const absolutePath = absolutingPath(rawPath);

    if (checkPathSync(absolutePath)) {
      const config = this.getConfig();
      config.backupFolder = absolutePath;
      fs.writeFileSync(this.CONFIG_FILE_PATH_INTERNAL, JSON.stringify(config));
      console.log(`backup folder setted to ${absolutePath}`);
    } else {
      console.error(`cannot set backup folder to ${absolutePath}`);
    }
  }

  /**
   * return config file in JSON
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
   */
  static getConfig() {
    return JSON.parse(
      fs.readFileSync(this.CONFIG_FILE_PATH_INTERNAL).toString()
    );
  }

  /**
   * delete an existing path from the configuration
   * @param {string|number} rawPath
   * @param {boolean} [isFile]
   */
  static delPath(rawPath, isFile) {
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

    fs.writeFileSync(this.CONFIG_FILE_PATH_INTERNAL, JSON.stringify(config));
    console.log(`path ${rawPath} removed from ${objectType}`);
  }
}

exports.JsonWriter = JsonWriter;
