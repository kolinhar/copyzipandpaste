const assert = require('assert');
const fs = require('fs');
const { JsonWriter } = require('../libs/JsonWriter');
const { DEFAULT_CONFIG } = require('../config/constants');
const configPathFile =
  'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste\\config\\dev\\files_sav.json';
const configPathFolder =
  'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste\\config\\dev';

before(function () {
  //silence the console
  console.log = function () {};
});

after(function () {
  //reset console
  delete console.log;
});

beforeEach(() => {
  fs.writeFileSync(configPathFile, JSON.stringify(DEFAULT_CONFIG));
});

describe('JsonWriter tests', () => {
  it('set configuration path file', () => {
    JsonWriter.setConfigFilePath(configPathFile);

    assert.strictEqual(JsonWriter.CONFIG_FILE_PATH_INTERNAL, configPathFile);
  });

  it('set a new file to save (true false)', () => {
    JsonWriter.setNewPath(configPathFile, { save: true, deletion: false });
    const { files } = JsonWriter.getConfig();

    assert.deepStrictEqual(files[0], {
      path: configPathFile,
      save: true,
      delete: false,
    });
  });

  it('set a new file to save (false true)', () => {
    JsonWriter.setNewPath(configPathFile, { save: false, deletion: true });
    const { files } = JsonWriter.getConfig();

    assert.deepStrictEqual(files[0], {
      path: configPathFile,
      save: false,
      delete: true,
    });
  });

  it('set a new file to save (true true)', () => {
    JsonWriter.setNewPath(configPathFile, { save: true, deletion: true });
    const { files } = JsonWriter.getConfig();

    assert.deepStrictEqual(files[0], {
      path: configPathFile,
      save: true,
      delete: true,
    });
  });

  it('set a new file to save (false false)', () => {
    JsonWriter.setNewPath(configPathFile, { save: false, deletion: false });
    const { files } = JsonWriter.getConfig();

    assert.deepStrictEqual(files[0], {
      path: configPathFile,
      save: false,
      delete: false,
    });
  });

  it('remove a file from list', () => {
    JsonWriter.setNewPath(configPathFile, { save: true, deletion: false });
    JsonWriter.delPath(0, true);

    const { files } = JsonWriter.getConfig();

    assert.deepStrictEqual(files, []);
  });

  it('update a file from list', () => {
    JsonWriter.setNewPath(configPathFile, { save: true, deletion: false });
    JsonWriter.setNewPath(configPathFile, { save: false, deletion: true });

    const { files } = JsonWriter.getConfig();

    assert.deepStrictEqual(files[0], {
      path: configPathFile,
      save: false,
      delete: true,
    });
  });

  it('set a new folder to save (true false)', () => {
    JsonWriter.setNewPath(configPathFolder, { save: true, deletion: false });
    const { directories } = JsonWriter.getConfig();

    assert.deepStrictEqual(directories[0], {
      path: configPathFolder,
      save: true,
      delete: false,
    });
  });

  it('set a new folder to save (false true)', () => {
    JsonWriter.setNewPath(configPathFolder, { save: false, deletion: true });
    const { directories } = JsonWriter.getConfig();

    assert.deepStrictEqual(directories[0], {
      path: configPathFolder,
      save: false,
      delete: true,
    });
  });

  it('set a new folder to save (true true)', () => {
    JsonWriter.setNewPath(configPathFolder, { save: true, deletion: true });
    const { directories } = JsonWriter.getConfig();

    assert.deepStrictEqual(directories[0], {
      path: configPathFolder,
      save: true,
      delete: true,
    });
  });

  it('set a new folder to save (false false)', () => {
    JsonWriter.setNewPath(configPathFolder, { save: false, deletion: false });
    const { directories } = JsonWriter.getConfig();

    assert.deepStrictEqual(directories[0], {
      path: configPathFolder,
      save: false,
      delete: false,
    });
  });

  it('remove a folder from list', () => {
    JsonWriter.setNewPath(configPathFolder, { save: true, deletion: false });
    JsonWriter.delPath(0, false);

    const { directories } = JsonWriter.getConfig();

    assert.deepStrictEqual(directories, []);
  });

  it('update a folder from list', () => {
    JsonWriter.setNewPath(configPathFolder, { save: true, deletion: false });
    JsonWriter.setNewPath(configPathFolder, { save: false, deletion: true });

    const { directories } = JsonWriter.getConfig();

    assert.deepStrictEqual(directories[0], {
      path: configPathFolder,
      save: false,
      delete: true,
    });
  });
});
