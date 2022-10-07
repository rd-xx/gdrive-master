// import { handleError } from './stdout.helper';
import { execSync } from 'child_process';

/**
 * Check if gcloud CLI is installed on the host machine.
 *
 * @returns Nothing.
 */
export function isGcloudInstalled() {
  try {
    execSync('gcloud --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Log in to the Google Cloud Platform. This will open a new browser window.
 *
 * @returns Nothing.
 */
export function login() {
  const login = spawnSync('gcloud', ['auth', 'login'], {
    shell: true
  });
  console.log(login.stdout.toString());
  console.log(login.stderr.toString());

  if (login.error) {
    console.log(login.error);
    return;
  }
}


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
