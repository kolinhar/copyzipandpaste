const child_process = require('child_process');
const fs = require('fs');
const assert = require('assert');
const { NpmrcWriter } = require('../src/libs/NpmrcWriter');
const { DEFAULT_CONFIG } = require('../src/config/constants');
const { formatJSONToNpmrc, absolutingPath } = require('../src/libs/utils');
const path = require('path');

const configPathFile = absolutingPath(`.${path.sep}test${path.sep}files.json`);
const configPathFolder = absolutingPath(`.${path.sep}test`);
const configPathFolder2 = 'C:\\Users\\rjuanes\\Documents\\Dev';

before(() => {
  fs.writeFileSync(configPathFile, '{"nothing": "special"}');

  child_process.execSync(
    `npm config set cpzs:test ${formatJSONToNpmrc(DEFAULT_CONFIG)}`,
    { encoding: 'utf8' }
  );
});

after(() => {
  // child_process.execSync(`npm config delete cpzs:test`, { encoding: 'utf8' });
  fs.rmSync(configPathFile, { recursive: true }, (err) => {
    err && console.error(err);
  });
});

describe('NpmrcWriter tests (slow tests)', function () {
  //no timeout for these tests
  this.timeout(0);
  describe('file to handle', () => {
    it('set a new file to save (true false)', () => {
      NpmrcWriter.setNewPath(
        configPathFile,
        { save: true, deletion: false },
        true
      );
      const { files } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(files[0], {
        path: configPathFile,
        save: true,
        delete: false,
      });
    });

    it('set a new file to save (false true)', () => {
      NpmrcWriter.setNewPath(
        configPathFile,
        { save: false, deletion: true },
        true
      );
      const { files } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(files[0], {
        path: configPathFile,
        save: false,
        delete: true,
      });
    });

    it('set a new file to save (true true)', () => {
      NpmrcWriter.setNewPath(
        configPathFile,
        { save: true, deletion: true },
        true
      );
      const { files } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(files[0], {
        path: configPathFile,
        save: true,
        delete: true,
      });
    });

    it('set a new file to save (false false)', () => {
      NpmrcWriter.setNewPath(
        configPathFile,
        { save: false, deletion: false },
        true
      );
      const { files } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(files[0], {
        path: configPathFile,
        save: false,
        delete: false,
      });
    });

    it('remove a file from list', () => {
      NpmrcWriter.setNewPath(
        configPathFile,
        { save: true, deletion: false },
        true
      );
      NpmrcWriter.delPath(0, true, true);

      const { files } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(files, []);
    });

    it('update a file from list', () => {
      NpmrcWriter.setNewPath(
        configPathFile,
        { save: true, deletion: false },
        true
      );
      NpmrcWriter.setNewPath(
        configPathFile,
        { save: false, deletion: true },
        true
      );

      const { files } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(files[0], {
        path: configPathFile,
        save: false,
        delete: true,
      });
    });
  });

  describe('folder to handle', () => {
    it('set a new folder to save (true false)', () => {
      NpmrcWriter.setNewPath(
        configPathFolder,
        { save: true, deletion: false },
        true
      );
      const { directories } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(directories[0], {
        path: configPathFolder,
        save: true,
        delete: false,
      });
    });

    it('set a new folder to save (false true)', () => {
      NpmrcWriter.setNewPath(
        configPathFolder,
        { save: false, deletion: true },
        true
      );
      const { directories } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(directories[0], {
        path: configPathFolder,
        save: false,
        delete: true,
      });
    });

    it('set a new folder to save (true true)', () => {
      NpmrcWriter.setNewPath(
        configPathFolder,
        { save: true, deletion: true },
        true
      );
      const { directories } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(directories[0], {
        path: configPathFolder,
        save: true,
        delete: true,
      });
    });

    it('set a new folder to save (false false)', () => {
      NpmrcWriter.setNewPath(
        configPathFolder,
        {
          save: false,
          deletion: false,
        },
        true
      );
      const { directories } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(directories[0], {
        path: configPathFolder,
        save: false,
        delete: false,
      });
    });

    it('remove a folder from list', () => {
      NpmrcWriter.setNewPath(
        configPathFolder,
        { save: true, deletion: false },
        true
      );
      NpmrcWriter.delPath(0, false, true);

      const { directories } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(directories, []);
    });

    it('update a folder from list', () => {
      NpmrcWriter.setNewPath(
        configPathFolder,
        { save: true, deletion: false },
        true
      );
      NpmrcWriter.setNewPath(
        configPathFolder,
        { save: false, deletion: true },
        true
      );

      const { directories } = NpmrcWriter.getConfig(true);

      assert.deepStrictEqual(directories[0], {
        path: configPathFolder,
        save: false,
        delete: true,
      });
    });
  });

  describe('backup folder to handle', () => {
    it('add a backup folder', () => {
      NpmrcWriter.setBackupFolder(configPathFolder, true);
      const { backupFolder } = NpmrcWriter.getConfig(true);

      assert.strictEqual(backupFolder, configPathFolder);
    });

    it('update a backup folder', () => {
      NpmrcWriter.setBackupFolder(configPathFolder, true);
      NpmrcWriter.setBackupFolder(configPathFolder2, true);
      const { backupFolder } = NpmrcWriter.getConfig(true);

      assert.strictEqual(backupFolder, configPathFolder2);
    });

    it('add a wrong backup folder and log the error', () => {
      NpmrcWriter.setBackupFolder('.\\here it is');
      const { backupFolder } = NpmrcWriter.getConfig(true);

      assert.strictEqual(backupFolder, configPathFolder2);
    });
  });
});
