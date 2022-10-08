import { execSync, spawnSync } from 'child_process';
import { PROJECT_NAME } from '../utils/constants';
import i18n from 'i18n';

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

export function createKey(): void {
  spawnSync('gcloud', ['iam', 'service-accounts', 'keys', 'create'], {
    shell: true
  });
}

export function setProject(projectId: string): boolean {
  const cmd = spawnSync('gcloud', ['config', 'set', 'project', projectId], {
    shell: true,
    input: 'n'
  });

  return cmd.stderr.toString().includes('Updated property');
}
