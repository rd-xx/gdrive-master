import { RequestOptions } from '../types/miscellaneous.types.js';

async function request(
  url: string,
  { method = 'GET', headers = {}, body = undefined }: RequestOptions
) {}

export function checkIfEmailExists(email: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fetch(`localhost:3000/gdrive/check/${email}`).then(async (res) => {
      if (res.status !== 200) {
        reject(
          'Ocorreu um erro inesperado ao verificar se o email da Google Drive existe.'
        );
        return;
      }

      const data = await res.json();
      resolve(data.data);
    });
  });
}
