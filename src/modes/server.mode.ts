import { gdriveLogin, getAvailableSpace } from '../helpers/gdrive.helper.js';
import { KEYS_QUANTITY, SERVICE_ACCOUNT_NAME } from '../utils/constants.js';
import { deleteKeyFile, getKeyFile } from '../helpers/file.helper.js';
import { getConfig, updateConfig } from '../helpers/config.helper.js';
import { DriveStorage } from '../utils/types.js';
import { oraPromise } from 'ora';
import axios from 'axios';
import chalk from 'chalk';
import i18n from 'i18n';
import {
  askProjectCreation,
  askKeysQuantity,
  askWorkingMode,
  askProjectId,
  askApiToken
} from '../helpers/prompts.helper.js';
import {
  createServiceAccountKey,
  createServiceAccount,
  enableDriveApi,
  createProject,
  setProject,
  createKey,
  getEmail
} from '../helpers/gcloud.helper.js';
import {
  printSettings,
  welcomeUser,
  handleError
} from '../helpers/stdout.helper.js';
import {
  isTokenValid,
  checkEmail,
  addAccount,
  addKeys
} from '../helpers/api.helper.js';

const t = i18n.__; // t stands for translate

export default async function serverMode() {
  const config = await getConfig();

  // Checks if the token is valid
  if (config.apiToken) {
    const tokenValid = await isTokenValid(config.apiToken as string);
    if (!tokenValid) {
      console.log('\n' + t(`prompts.apiToken.expired`) + '\n');
      await updateConfig({ apiToken: null });
      return;
    }
  } else {
    const token = await askApiToken();
    if (!token) return;
    updateConfig({ apiToken: token });
    config.apiToken = token;
    // console.log(t(`prompts.apiToken.updated`));
  }

  axios.defaults.headers.common['Authorization'] = config.apiToken;

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
  printSettings('server', workingMode, keysQuantity);

  // Enable the Google Drive API
  await oraPromise(enableDriveApi(), {
    text: `] ${t('gcloud.api.enabling', chalk.cyan('Google Drive'))}`,
    successText: `] ${t('gcloud.api.enabled', chalk.cyan('Google Drive'))}\n`,
    prefixText: '['
  });

  const email = getEmail(),
    accountExists = (await checkEmail(email)).data;

  // Create service account & key if the account doesn't exist in the database
  let serviceAccountKey: Record<string, string> | undefined,
    availableSpace: DriveStorage | undefined;
  if (!accountExists) {
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

    serviceAccountKey = await getKeyFile();
    const gdriveInstance = gdriveLogin();
    availableSpace = await getAvailableSpace(gdriveInstance);
    await deleteKeyFile();
  }

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
    else return handleError(output);
  }
  console.log(chalk.green(t('gcloud.keys.done')));

  // Add the keys to the database
  if (accountExists) {
    await addKeys(email, keys);
    console.log('\n\n' + t('api.addedKeys'));
  } else {
    if (!serviceAccountKey || !availableSpace)
      return handleError(t('errors.serviceAccountKey'));

    await addAccount(
      email,
      Number(availableSpace.limit) - Number(availableSpace.usage),
      serviceAccountKey,
      keys
    );
    console.log('\n\n' + t('api.addedAccount'));
  }
}
