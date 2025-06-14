#!/usr/bin/env node

import setJsonVersion from './index.js';

function printUsageAndExit (errorMessage) {
  if (errorMessage) {
    console.error(`Error: ${errorMessage}\n`);
  }
  console.log('Usage: set-json-version --version <version> --files <file1> [<file2> ...]');
  console.log('       set-json-version -v <version> -f <file1> [<file2> ...]\n');
  console.log('Options:');
  console.log('  -v, --version   The version to set in the JSON files (required)');
  console.log('  -f, --files     A list of JSON files to update (required)');
  console.log('  -h, --help      Show this help message');
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  printUsageAndExit();
}

// Find the version argument first
const versionIndex = args.findIndex((arg) => arg === '--version' || arg === '-v');

if (versionIndex === -1) {
  printUsageAndExit('No version flag specified.');
}

const version = args[versionIndex + 1];

if (!version || version.startsWith('-')) {
  printUsageAndExit('Version value is missing or invalid.');
}

// Find the files argument
const filesIndex = args.findIndex((arg) => arg === '--files' || arg === '-f');

if (filesIndex === -1) {
  printUsageAndExit('No files flag specified.');
}

const filePaths = [];
// All subsequent arguments are file paths until another flag is encountered
for (let i = filesIndex + 1; i < args.length; i++) {
  if (args[i].startsWith('-')) {
    break;
  }
  filePaths.push(args[i]);
}

if (filePaths.length === 0) {
  printUsageAndExit('No file paths were provided.');
}

setJsonVersion({ filePaths, version })
  .catch((error) => {
    console.error(`An error occurred: ${error.message}`);
    process.exit(1);
  });
