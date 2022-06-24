#!/usr/bin/env node

import setJsonVersion from './index.js';

const argList = process.argv.join('=').split('=');

let versionIndex;
let filesIndexStart;
let filesIndexEnd;

argList.forEach((item, index) => {
  if (item === '--files' || item === '-f') {
    filesIndexStart = index + 1;
  } else if (item === '--version' || item === '-v') {
    versionIndex = index + 1;
    filesIndexEnd = index;
  }
});

if (!filesIndexStart) {
  console.error('No files specified');
  process.exit(1);
}

if (!versionIndex || versionIndex === filesIndexStart) {
  console.error('No version specified');
  process.exit(1);
}

const version = argList[versionIndex];
const filePaths = argList.slice(filesIndexStart, filesIndexEnd);

setJsonVersion({ filePaths, version }).catch((error) => {
  console.error(error);
  process.exit(1);
});
