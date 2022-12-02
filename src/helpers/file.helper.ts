import { handleError } from './stdout.helper.js';
import { readdir, writeFile } from 'fs';
import fsExtra from 'fs-extra';
import { join } from 'path';

const { readJSON, rm } = fsExtra;

export async function saveKeys(
  email: string,
  keys: string[]
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    readdir(process.cwd(), (errRead, files) => {
      if (errRead) {
        handleError(errRead.message);
        return reject(false);
      }

      const keysFiles = files.filter((file) => file.includes('keys'));
      let i = 1;
      while (keysFiles.includes(`keys${i}.json`)) i++;

      const filePath = join(process.cwd(), `keys${i}.json`);
      writeFile(filePath, `${email}\n${keys.join('\n')}`, (errWrite) => {
        if (errWrite) {
          handleError(errWrite.message);
          return reject(null);
        }

        return resolve(`keys${i}.json`);
      });
    });
  });
}

export async function getKeyFile(): Promise<Record<string, string>> {
  return await readJSON(join(globalThis.paths.root, 'key.json'));
}

export async function deleteKeyFile(): Promise<void> {
  await rm(join(globalThis.paths.root, 'key.json'));
}
