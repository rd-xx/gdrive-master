import { KEYS_QUANTITY } from './utils/constants.js';
import { saveKeys } from './helpers/file.helper.js';
import { dirname, join } from 'path';
import { oraPromise } from 'ora';
import chalk from 'chalk';
import i18n from 'i18n';
import {
  getConfig,
  isFirstTime,
  writeConfig
} from './helpers/config.helper.js';

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

  // Checks if it's the first time the user is running the program
  if (await isFirstTime()) {
    console.log(t(`firstTime.welcome`), '\n');
    console.log(t(`firstTime.one`, chalk.yellow(t(`firstTime.two`))));
    console.log();

    writeConfig({ debug: false, verbose: false, apiToken: null });
    exit();
  }

  const config = await getConfig();

  // Checking if gcloud is installed
  await oraPromise(isGcloudInstalled(), {
    text: `] ${i18n.__('gcloud.checking', chalk.cyan('gcloud CLI'))}`,
    successText: `] ${i18n.__('gcloud.installed', chalk.cyan('gcloud CLI'))}\n`,
    failText: `] ${i18n.__('gcloud.notInstalled', chalk.cyan('gcloud CLI'))}`,
    prefixText: '['
  });

  // Logout from gcloud
  if (config.verbose)
    await oraPromise(logout(), {
      text: `] ${t('gcloud.logout.ongoing')}`,
      successText: `] ${t('gcloud.logout.done')}`,
      prefixText: '['
    });
  else await logout();

  // Login to gcloud
  try {
    await oraPromise(login(), {
      text: `] ${t('gcloud.login.ongoing')}`,
      successText: `] ${t('gcloud.login.done')}\n`,
      failText: `] ${chalk.red(t('gcloud.login.failed'))}`,
      prefixText: '['
    });
  } catch (err) {
    console.log();
    return exit();
  }

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
