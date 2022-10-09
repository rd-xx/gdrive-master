import { handleError } from './stdout.helper.js';
import { readdir, writeFile } from 'fs';
import { join } from 'path';

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
