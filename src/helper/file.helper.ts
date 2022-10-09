import { handleError } from './stdout.helper.js';
import { dirname, join, normalize } from 'path';
import { readdir, writeFile } from 'fs';
import { fileURLToPath } from 'url';

export async function saveKeys(
  email: string,
  keys: string[]
): Promise<string | null> {
  const __filename = fileURLToPath(import.meta.url),
    __dirname = dirname(__filename),
    rootDirectory = normalize(join(__dirname, '..', '..'));

  return new Promise((resolve, reject) => {
    readdir(rootDirectory, (errRead, files) => {
      if (errRead) {
        handleError(errRead.message);
        return reject(false);
      }

      const keysFiles = files.filter((file) => file.includes('keys'));
      let i = 1;
      while (keysFiles.includes(`keys${i}.json`)) i++;

      const filePath = join(rootDirectory, `keys${i}.json`);
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
