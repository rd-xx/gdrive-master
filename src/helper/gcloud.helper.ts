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

/**
 * Log out from all accounts.
 *
 * @returns Nothing.
 */
export function logout(): void {
  spawnSync('gcloud', ['auth', 'revoke', '--all'], {
    shell: true
  });
}

/**
 * Create a new project on the Google Cloud Platform.
 *
 * @returns Nothing.
 */
export function createProject(): void {
  let created = false;
  while (!created) {
    const randomNumber = Math.floor(Math.random() * (10000 - 0 + 1) + 0),
      projectId = `${PROJECT_NAME.toLowerCase()}-${randomNumber}`,
      cmd = spawnSync(
        'gcloud',
        ['projects', 'create', projectId, '--name', PROJECT_NAME],
        {
          shell: true
        }
      );

    if (!cmd.stderr.toString().includes('already exists')) created = true;
  }
}

export function createKey(): void {
  spawnSync('gcloud', ['iam', 'service-accounts', 'keys', 'create'], {
    shell: true
  });
}
