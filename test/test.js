// before(function () {
//   //silence the console
//   console.log = function () {};
//   console.error = function () {};
// });

// after(function () {
//   //reset console
//   delete console.log;
//   delete console.error;
// });

describe('FileMover class', function () {
  require('./FileMoverClass/index');
});

describe('utils file', () => {
  require('./utils.test');
});

describe('JsonWriter static class', () => {
  require('./JsonWriter.test');
});

describe('FolderMover class', function () {
  require('./FolderMoverClass/index');
});
