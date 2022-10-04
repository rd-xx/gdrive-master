// import { handleError } from './stdout.helper';
import { execSync } from 'child_process';

export function isGcloudInstalled() {
  try {
    execSync('gcloud --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// wip
// export function logout(): boolean {
//   const buf = '';
//   try {
//     // logout from all gcloud accounts (if any)
//     const as = execSync('gcloud auth list', { stdio: 'pipe' });
//     console.log(as.toString());

//     return true;
//   } catch (error) {
//     console.log('tou aqui');
//     console.log(buf);
//     console.log('"\n');

//     if (error instanceof Error) {
//       console.log(error.message);
//       console.log(error.stack);
//       console.log(error.name);
//       console.log(error.cause);
//     }

//     handleError(String(error));
//     return false;
//   }
// }
