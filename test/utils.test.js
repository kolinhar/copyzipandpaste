const assert = require('assert');
const {
  getCurrentFolderName,
  getCurrentPathFromFilePath,
  checkPath,
  absolutingPath,
  m10,
} = require('../src/libs/utils');

describe('getCurrentFolderName', () => {
  it('should return the last folder of an absolute path', () => {
    assert.strictEqual(getCurrentFolderName(__dirname), 'test');
  });

  it('should return the last folder of an absolute path', () => {
    assert.strictEqual(
      getCurrentFolderName(
        'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste\\test\\FileMoverClass'
      ),
      'FileMoverClass'
    );
  });

  it('should return the last folder of an absolute path', () => {
    assert.strictEqual(
      getCurrentFolderName(
        'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste'
      ),
      'copyzipandpaste'
    );
  });

  it('should return the last folder of an absolute path', () => {
    assert.strictEqual(
      getCurrentFolderName(
        'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste'
      ),
      'copyzipandpaste'
    );
  });

  it('should return false with a relative path', () => {
    assert.strictEqual(
      getCurrentFolderName('.\\WebstormProjects\\copyzipandpaste'),
      false
    );
  });

  it('should return false with a relative path', () => {
    assert.strictEqual(
      getCurrentFolderName('..\\WebstormProjects\\copyzipandpaste'),
      false
    );
  });
});

describe('getCurrentFolderNameFromFilePath', () => {
  it('should return the absolute path of folder from an absolute file path', () => {
    assert.strictEqual(
      getCurrentPathFromFilePath(__filename),
      'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste\\test'
    );
  });

  it('should return the absolute path of folder from an absolute file path', () => {
    assert.strictEqual(
      getCurrentPathFromFilePath(__filename),
      'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste\\test'
    );
  });

  it('should return the absolute path of folder from an absolute file path', () => {
    assert.strictEqual(
      getCurrentPathFromFilePath(__filename),
      'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste\\test'
    );
  });

  it('should return false with a relative file path', () => {
    assert.strictEqual(
      getCurrentPathFromFilePath('.\\WebstormProjects\\copyzipandpaste\\test'),
      false
    );
  });

  it('should return false with a relative file path', () => {
    assert.strictEqual(
      getCurrentPathFromFilePath('..\\WebstormProjects\\copyzipandpaste\\test'),
      false
    );
  });
});

describe('checkAbsolutePath', () => {
  it('should works', (done) => {
    assert.doesNotReject(checkPath(__filename)).finally(done);
  });

  it('should works', (done) => {
    assert.doesNotReject(checkPath(__dirname)).finally(done);
  });

  it('should reject', (done) => {
    assert
      .rejects(
        checkPath(
          'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste\\doesntExist'
        )
      )
      .finally(done);
  });
});

describe('absolutingPath', () => {
  it('should works', () => {
    assert.strictEqual(absolutingPath(__filename), __filename);
  });

  it('should works', () => {
    assert.strictEqual(absolutingPath(__dirname), __dirname);
  });

  it('should works', () => {
    assert.strictEqual(
      absolutingPath('.\\test\\FileMoverClass'),
      'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste\\test\\FileMoverClass'
    );
  });

  it('should works', () => {
    assert.strictEqual(
      absolutingPath('..\\test\\FileMoverClass'),
      'C:\\Users\\rjuanes\\Documents\\Dev\\test\\FileMoverClass'
    );
  });

  it('should works', () => {
    assert.strictEqual(
      absolutingPath('.\\FileMoverClass'),
      'C:\\Users\\rjuanes\\Documents\\Dev\\copyzipandpaste\\FileMoverClass'
    );
  });

  describe('m10', () => {
    it('shoud return "00"', () => {
      assert.deepStrictEqual(m10(0), '00');
    });
    it('shoud return "01"', () => {
      assert.deepStrictEqual(m10(1), '01');
    });
    it('shoud return "03"', () => {
      assert.deepStrictEqual(m10(3), '03');
    });
    it('shoud return "09"', () => {
      assert.deepStrictEqual(m10(9), '09');
    });
    it('shoud return "10"', () => {
      assert.deepStrictEqual(m10(10), '10');
    });
    it('shoud return "100"', () => {
      assert.deepStrictEqual(m10(100), '100');
    });
  });
});
