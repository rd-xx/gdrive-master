import { KEYS_QUANTITY, SERVICE_ACCOUNT_NAME } from '../utils/constants.js';
import { oraPromise } from 'ora';
import chalk from 'chalk';
import i18n from 'i18n';
import {
  askProjectCreation,
  askKeysQuantity,
  askWorkingMode,
  askProjectId
} from '../helpers/prompts.helper.js';
import {
  createServiceAccountKey,
  createServiceAccount,
  enableDriveApi,
  createProject,
  setProject,
  createKey
} from '../helpers/gcloud.helper.js';
import {
  printSettings,
  welcomeUser,
  handleError
} from '../helpers/stdout.helper.js';

const t = i18n.__; // t stands for translate

export default async function standaloneMode() {
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

  await welcomeUser();
  printSettings('standalone', workingMode, keysQuantity);

  // Enable the Google Drive API
  await oraPromise(enableDriveApi(), {
    text: `] ${t('gcloud.api.enabling', chalk.cyan('Google Drive'))}`,
    successText: `] ${t('gcloud.api.enabled', chalk.cyan('Google Drive'))}\n`,
    prefixText: '['
  });

  // Create the service account
  await oraPromise(createServiceAccount(), {
    text: `] ${t(
      'gcloud.serviceAccount.ongoing',
      chalk.cyan(SERVICE_ACCOUNT_NAME)
    )}`,
    successText: `] ${t('gcloud.serviceAccount.done')}`,
    prefixText: '['
  });

  // Create the service account key
  await oraPromise(createServiceAccountKey(), {
    text: `] ${t('gcloud.serviceAccountKey.ongoing')}`,
    successText: `] ${t('gcloud.serviceAccountKey.done')}\n`,
    prefixText: '['
  });

  // Create the keys
  const keys: string[] = [];
  for (let i = 0; i < keysQuantity; i++) {
    const output = await oraPromise(createKey(), {
      text: `] ${t('gcloud.keys.creating', chalk.cyan(i + 1))}`,
      successText: `] ${t('gcloud.keys.created', chalk.cyan(i + 1))}`,
      failText: `] ${t('gcloud.keys.failed', chalk.cyan(i + 1))}\n`,
      prefixText: '['
    });

    if (output.startsWith('AIza')) keys.push(output);
    else return await handleError(output);
  }
  console.log(chalk.green(t('gcloud.keys.done')));

  await welcomeUser();
  printSettings('standalone', workingMode, keysQuantity);

  console.log('\n\n» Récapitulatif');
  console.log(`  - ${t('standalone.projectId')}: ${projectId}`);
  console.log(
    `  - ${t('standalone.serviceAccountKey')}: ` + chalk.yellow('key.json')
  );
  console.log(
    `  - ${t('standalone.keys')}: ` +
      chalk.cyan(keys.join(chalk.reset(',') + chalk.cyan(' ')))
  );
}
