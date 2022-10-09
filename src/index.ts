import { OperatingMode } from './types/miscellaneous.types.js';
import { KEYS_QUANTITY } from './utils/constants.js';
import { saveKeys } from './helper/file.helper.js';
import { dirname, join, normalize } from 'path';
import { fileURLToPath } from 'url';
import { oraPromise } from 'ora';
import chalk from 'chalk';
import i18n from 'i18n';
import {
  askProjectCreation,
  askKeysQuantity,
  askWorkingMode,
  askProjectId,
  askSaveKeys
} from './helper/prompts.helper.js';
import {
  isGcloudInstalled,
  enableDriveApi,
  createProject,
  setProject,
  createKey,
  getEmail
} from './helper/gcloud.helper.js';
import {
  printSettings,
  handleError,
  welcomeUser,
  exit
} from './helper/stdout.helper.js';

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
    text: `] ${i18n.__('gcloud.checking', chalk.cyan('gcloud CLI'))}`,
    successText: `] ${i18n.__('gcloud.installed', chalk.cyan('gcloud CLI'))}\n`,
    failText: `] ${i18n.__('gcloud.notInstalled', chalk.cyan('gcloud CLI'))}`,
    prefixText: '['
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

  // Ask how many keys the user wants to create
  const keysQuantity =
    workingMode === 'auto' ? KEYS_QUANTITY : await askKeysQuantity();
  if (!keysQuantity) return;

  welcomeUser();
  printSettings(operatingMode, workingMode, keysQuantity);

  // Enable the Google Drive API
  await oraPromise(enableDriveApi(), {
    text: `] ${i18n.__('gcloud.api.enabling', chalk.cyan('Google Drive'))}`,
    successText: `] ${i18n.__(
      'gcloud.api.enabled',
      chalk.cyan('Google Drive')
    )}\n`,
    prefixText: '['
  });

  // Create the keys
  const keys: string[] = [];
  for (let i = 0; i < keysQuantity; i++) {
    const output = await oraPromise(createKey(), {
      text: `] ${i18n.__('gcloud.keys.creating', chalk.cyan(i + 1))}`,
      successText: `] ${i18n.__('gcloud.keys.created', chalk.cyan(i + 1))}`,
      failText: `] ${i18n.__('gcloud.keys.failed', chalk.cyan(i + 1))}\n`,
      prefixText: '['
    });

    if (output.startsWith('AIza')) keys.push(output);
    else return handleError(output);
  }
  console.log(i18n.__('gcloud.keys.done') + '\n');

  // Save the keys
  const shouldSave = await askSaveKeys();
  if (shouldSave === undefined) return;
  else if (shouldSave) {
    const email = getEmail(),
      fileName = await saveKeys(email, keys);
    if (!fileName) return;
    console.log(i18n.__('prompts.keys.save.saved'), chalk.cyan(fileName));
  }

  console.log('\n' + i18n.__('exit.bye'));
  exit();
}

main();
