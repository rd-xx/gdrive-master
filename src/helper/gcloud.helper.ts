import { PROJECT_NAME, SERVICE_ACCOUNT_NAME } from '../utils/constants.js';
import { execSync, spawn, spawnSync } from 'child_process';
import i18n from 'i18n';

/**
 * Check if gcloud CLI is installed on the host machine.
 *
 * @returns Nothing.
 */
export async function isGcloudInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      execSync('gcloud --version', { stdio: 'ignore' });
      return resolve(true);
    } catch (error) {
      return resolve(false);
    }
  });
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
 * @returns Project Id as a string, or nothing if the project creation failed.
 */
export function createProject(): string | void {
  let created = false,
    projectId = '';

  while (!created) {
    const randomNumber = Math.floor(Math.random() * (10000 - 0 + 1) + 0);
    projectId = `${PROJECT_NAME.toLowerCase()}-${randomNumber}`;
    const cmd = spawnSync(
      'gcloud',
      ['projects', 'create', projectId, '--name', PROJECT_NAME],
      {
        shell: true
      }
    );

    if (cmd.stderr.toString().includes('project quota')) {
      console.log('[❌]', i18n.__('gcloud.projectQuotaExceeded'));
      return;
    }

    created = cmd.stderr.toString().includes('already exists');
  }

  return projectId;
}

export function createServiceAccount(): void {
  spawnSync(
    'gcloud',
    ['iam', 'service-accounts', 'create', SERVICE_ACCOUNT_NAME],
    {
      shell: true
    }
  );
}

export function createKey(): void {
  spawnSync('gcloud', ['iam', 'service-accounts', 'keys', 'create'], {
    shell: true
  });
}

export async function setProject(projectId: string): Promise<boolean> {
  return new Promise((resolve) => {
    const cmd = spawn('gcloud', ['config', 'set', 'project', projectId], {
      shell: true
    });

    cmd.stderr.on('data', (data) => {
      if (String(data).includes('does not exist')) return resolve(false);
      else if (String(data).includes('Updated property')) return resolve(true);
    });
  });
}

export function getServiceAccount(): string | null {
  const cmd = spawnSync('gcloud', ['iam', 'service-accounts', 'list'], {
    shell: true
  });

  if (cmd.stderr.toString().includes('0 items')) return null;

  const wholeLine = cmd.stdout.toString().split('\n')[1],
    email = wholeLine
      .split(' ')
      .filter((value) =>
        new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(value)
      );

  return email[0];
}

export async function enableDriveApi(): Promise<void> {
  return new Promise((resolve) => {
    const cmd = spawn(
      'gcloud',
      ['services', 'enable', 'drive.googleapis.com'],
      {
        shell: true
      }
    );

    cmd.on('exit', () => resolve());
  });
}
