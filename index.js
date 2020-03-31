const fs = require('fs');
const argList = process.argv.join('=').split('=');

let versionIndex;
let filesIndexStart;
let filesIndexEnd;

argList.forEach((item, index, array) => {
  if (item === '--files' || item === '-f') {
    filesIndexStart = index + 1;
  } else if (item === '--version' || item === '-v') {
    versionIndex = index + 1;
    filesIndexEnd = index;
  }
})

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

const writeJsonToFile = (filePath, json) => {
  const stringifedJson = JSON.stringify(json, null, 2);
  fs.writeFile(filePath, stringifedJson, 'utf8', (err) => {
    if (err) {
      console.error('Could not write to ' + filePath);
    } else {
      console.log('Setting version for ' + filePath);
    }
  });
};

const readJsonFromFile = (filePath, callback) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.warn('Could not open ' + filePath);
    } else {
      try {
        const json = JSON.parse(data);
        callback(json);
      } catch (e) {
        console.error('Could not parse JSON in ' + filePath, e);
      }
    }    
  });
};

filePaths.forEach(function (filePath) {
  readJsonFromFile(filePath, (json) => {
    if (typeof json === 'object') {
      json.value = version;
      writeJsonToFile(filePath, json);
    } else {
      console.error('Root type is not an object'); 
    }
  });
});