const assert = require("assert");
const {
    getCurrentFolderName,
    getCurrentPathFromFilePath,
    checkPath,
    absolutingPath
} = require("../libs/utils");

describe('getCurrentFolderName', () => {
    it('should return the last folder of an absolute path', () => {
        assert.strictEqual(getCurrentFolderName(__dirname), "test");
    });

    it('should return the last folder of an absolute path', () => {
        assert.strictEqual(getCurrentFolderName("C:\\Users\\root\\WebstormProjects\\copyzipandpaste\\test\\FileMoverClass"), "FileMoverClass");
    });

    it('should return the last folder of an absolute path', () => {
        assert.strictEqual(getCurrentFolderName("C:\\Users\\root\\WebstormProjects\\copyzipandpaste"), "copyzipandpaste");
    });

    it('should return the last folder of an absolute path', () => {
        assert.strictEqual(getCurrentFolderName("C:\\Users\\root\\WebstormProjects\\copyzipandpaste"), "copyzipandpaste");
    });

    it('should return false with a relative path', () => {
        assert.strictEqual(getCurrentFolderName(".\\WebstormProjects\\copyzipandpaste"), false);
    });

    it('should return false with a relative path', () => {
        assert.strictEqual(getCurrentFolderName("..\\WebstormProjects\\copyzipandpaste"), false);
    });
});

describe('getCurrentFolderNameFromFilePath', () => {
    it('should return the absolute path of folder from an absolute file path', () => {
        assert.strictEqual(getCurrentPathFromFilePath(__filename), "C:\\Users\\root\\WebstormProjects\\copyzipandpaste\\test");
    });

    it('should return the absolute path of folder from an absolute file path', () => {
        assert.strictEqual(getCurrentPathFromFilePath(__filename), "C:\\Users\\root\\WebstormProjects\\copyzipandpaste\\test");
    });

    it('should return the absolute path of folder from an absolute file path', () => {
        assert.strictEqual(getCurrentPathFromFilePath(__filename), "C:\\Users\\root\\WebstormProjects\\copyzipandpaste\\test");
    });

    it('should return false with a relative file path', () => {
        assert.strictEqual(getCurrentPathFromFilePath(".\\WebstormProjects\\copyzipandpaste\\test"), false);
    });

    it('should return false with a relative file path', () => {
        assert.strictEqual(getCurrentPathFromFilePath("..\\WebstormProjects\\copyzipandpaste\\test"), false);
    });
});

describe('checkAbsolutePath', () => {
    it('should works', done => {
        assert.doesNotReject(checkPath(__filename))
            .finally(done);
    });

    it('should works', done => {
        assert.doesNotReject(checkPath(__dirname))
            .finally(done);
    });

    it('should reject', done => {
        assert.rejects(checkPath("C:\\Users\\root\\WebstormProjects\\copyzipandpaste\\doesntExist"))
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
        assert.strictEqual(absolutingPath(".\\test\\FileMoverClass"), "C:\\Users\\root\\WebstormProjects\\copyzipandpaste\\test\\FileMoverClass");
    });

    it('should works', () => {
        assert.strictEqual(absolutingPath("..\\test\\FileMoverClass"), "C:\\Users\\root\\WebstormProjects\\test\\FileMoverClass");
    });

    it('should works', () => {
        assert.strictEqual(absolutingPath(".\\FileMoverClass"), "C:\\Users\\root\\WebstormProjects\\copyzipandpaste\\FileMoverClass");
    });
});