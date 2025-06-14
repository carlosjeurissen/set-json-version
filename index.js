import fs from 'node:fs';

async function handleSingleFile ({ filePath, version }) {
  try {
    // 1. Read the file content.
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const json = JSON.parse(fileContent);

    // 2. Validate that the root of the JSON is an object.
    if (typeof json !== 'object' || json === null || Array.isArray(json)) {
      throw new Error('The root of the JSON file must be an object.');
    }

    // 3. Update the version and write the file back.
    json.version = version;
    const stringifiedJson = JSON.stringify(json, null, 2);
    await fs.promises.writeFile(filePath, stringifiedJson, 'utf8');
  } catch (error) {
    // 4. Add context to any errors that occur.
    throw new Error(`Failed to process file "${filePath}": ${error.message}`);
  }
}

export default async function setJsonVersion ({ filePaths, version }) {
  const allFilePromises = filePaths.map((filePath) => handleSingleFile({ filePath, version }));
  await Promise.all(allFilePromises);
}
