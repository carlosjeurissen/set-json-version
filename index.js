import fs from 'node:fs';

function writeJsonToFile (filePath, json) {
  const stringifedJson = JSON.stringify(json, null, 2);
  return fs.promises.writeFile(filePath, stringifedJson, 'utf8');
}

function readJsonFromFile (filePath) {
  return fs.promises.readFile(filePath, 'utf8').then(JSON.parse);
}

async function handleSingleFile ({ filePath, version }) {
  const json = await readJsonFromFile(filePath);
  if (typeof json !== 'object' || json === null) {
    throw new Error('Root type is not an object');
  }
  json.version = version;
  await writeJsonToFile(filePath, json);
}

export default function setJsonVersion ({ filePaths, version }) {
  const promises = filePaths.map((filePath) => handleSingleFile({ filePath, version }));
  return Promise.all(promises);
}
