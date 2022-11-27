import { KEYS_QUANTITY } from './utils/constants.js';
import { saveKeys } from './helper/file.helper.js';
import { dirname, join } from 'path';
import { oraPromise } from 'ora';
import chalk from 'chalk';
import i18n from 'i18n';
import {
  askProjectCreation,
  askOperatingMode,
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
  getEmail,
  logout,
  login
} from './helper/gcloud.helper.js';
import {
  printSettings,
  handleError,
  welcomeUser,
  exit
} from './helper/stdout.helper.js';

// Setup i18n
i18n.configure({
  locales: ['en', 'fr', 'pt'],
  defaultLocale: 'en',
  fallbacks: { 'fr-*': 'fr', 'pt-*': 'pt' },
  directory: process.argv[1].includes('snapshot')
    ? join(dirname(dirname(process.argv[1])), 'locales')
    : join(process.cwd(), 'locales'),
  objectNotation: true
});
i18n.setLocale(Intl.DateTimeFormat().resolvedOptions().locale);

async function main() {
  // Print the project name + version
  await welcomeUser();

  // Checking if gcloud is installed
  await oraPromise(isGcloudInstalled(), {
    text: `] ${i18n.__('gcloud.checking', chalk.cyan('gcloud CLI'))}`,
    successText: `] ${i18n.__('gcloud.installed', chalk.cyan('gcloud CLI'))}\n`,
    failText: `] ${i18n.__('gcloud.notInstalled', chalk.cyan('gcloud CLI'))}`,
    prefixText: '['
  });

  logout();
  login();

  // Ask the user what which operating mode he wants to use
  const operatingMode = await askOperatingMode();
  if (!operatingMode) return;

  // Ask the user what which working mode he wants to use
  const workingMode = await askWorkingMode();
  if (!workingMode) return;

  // Set the working project on glcoud
  let projectId: string | void;
  if (workingMode === 'auto') projectId = createProject();
  else {
    const shouldCreateNewProject = await askProjectCreation();
    if (shouldCreateNewProject === undefined) return;
    else if (shouldCreateNewProject) projectId = createProject();
    else projectId = await askProjectId();
  }

  if (!projectId) return;
  setProject(projectId);

  // Ask how many keys the user wants to create
  const keysQuantity =
    workingMode === 'auto' ? KEYS_QUANTITY : await askKeysQuantity();
  if (!keysQuantity) return;

  const shouldSave = await askSaveKeys();
  if (shouldSave === undefined) return;

  await welcomeUser();
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
  console.log(i18n.__('gcloud.keys.done'));

  // Save the keys
  if (shouldSave) {
    const email = getEmail(),
      fileName = await saveKeys(email, keys);
    if (!fileName) return;
    console.log(i18n.__('prompts.keys.save.saved'), chalk.cyan(fileName));
  } else {
    console.log('');
    for (const key of keys) console.log(key);
  }

  console.log('\n' + i18n.__('exit.bye'));
  exit();
}

main();

process.on('uncaughtException', async (error) => {
  if (error.message.includes('EPIPE')) return;
  handleError(`${error.name}\n${error.message}\n\n${error.stack}`);
});
