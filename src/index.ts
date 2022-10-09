import { printSettings, welcomeUser } from './helper/stdout.helper.js';
import { OperatingMode } from './types/miscellaneous.types.js';
import { KEYS_QUANTITY } from './utils/constants.js';
import { dirname, join, normalize } from 'path';
import { fileURLToPath } from 'url';
import { oraPromise } from 'ora';
import chalk from 'chalk';
import i18n from 'i18n';
import {
  askProjectCreation,
  askKeysQuantity,
  askWorkingMode,
  askProjectId
} from './helper/prompts.helper.js';
import {
  isGcloudInstalled,
  getServiceAccount,
  createProject,
  setProject
} from './helper/gcloud.helper.js';

const __filename = fileURLToPath(import.meta.url),
  __dirname = dirname(__filename);

// Setup i18n
i18n.configure({
  locales: ['en', 'fr', 'pt'],
  defaultLocale: 'en',
  fallbacks: { 'fr-*': 'fr', 'pt-*': 'pt' },
  directory: normalize(join(__dirname, '..', 'locales')),
  objectNotation: true
});
i18n.setLocale(Intl.DateTimeFormat().resolvedOptions().locale);

// Print the project name + version
welcomeUser();

async function main() {
  // Checking if gcloud is installed
  await oraPromise(isGcloudInstalled(), {
    text: `[🔨] ${i18n.__('gcloud.check', chalk.cyan('gcloud CLI'))}`,
    successText: `[✅] ${i18n.__(
      'gcloud.installed',
      chalk.cyan('gcloud CLI')
    )}`,
    failText: `[❌] ${i18n.__(
      'gcloud.notInstalled',
      chalk.cyan('gcloud CLI')
    )}`,
    interval: 400
  });
  // ora.succeed();
  // logout();
  // login();

  // Ask the user what which working mode he wants to use
  const operatingMode: OperatingMode = 'standalone',
    workingMode = await askWorkingMode();
  if (!workingMode) return;

  // Set the working project on glcoud
  if (workingMode === 'auto') {
    const projectId = createProject();
    if (!projectId) return;
    setProject(projectId);
  } else {
    const shouldCreateNewProject = await askProjectCreation();
    if (shouldCreateNewProject === undefined) return;
    else if (shouldCreateNewProject) {
      const projectId = createProject() || '';
      if (!projectId) return;
      setProject(projectId);
    } else await askProjectId();
  }

  const keysQuantity =
    workingMode === 'auto' ? KEYS_QUANTITY : await askKeysQuantity();
  if (!keysQuantity) return;

  welcomeUser();
  printSettings(operatingMode, workingMode, keysQuantity);

  const serviceAccount = getServiceAccount();
  console.log('serviceAccount -----------');
  console.log(serviceAccount);

  // create the keys with for i loop
  // for (let i = 0; i < keysQuantity; i++) createKey();
}

main();
