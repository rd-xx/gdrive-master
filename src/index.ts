import { KEYS_QUANTITY } from './utils/constants.js';
import { saveKeys } from './helpers/file.helper.js';
import { dirname, join } from 'path';
import { oraPromise } from 'ora';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import i18n from 'i18n';
import {
  getConfig,
  isFirstTime,
  writeConfig
} from './helpers/config.helper.js';

// Init dotenv
dotenv.config();

// Setup global variables
const rootPath = process.argv[1].includes('snapshot')
  ? dirname(dirname(process.argv[1]))
  : process.cwd();
global.paths = {
  root: rootPath,
  config: join(rootPath, 'config.json'),
  locales: join(rootPath, 'locales')
};

// Setup i18n
i18n.configure({
  locales: ['en', 'fr', 'pt'],
  defaultLocale: 'en',
  fallbacks: { 'fr-*': 'fr', 'pt-*': 'pt' },
  directory: globalThis.paths.locales,
  objectNotation: true
});
i18n.setLocale(Intl.DateTimeFormat().resolvedOptions().locale);
const t = i18n.__; // t stands for translate

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
    text: `] ${t('gcloud.cli.ongoing', chalk.cyan('gcloud CLI'))}`,
    failText: `] ${t('gcloud.cli.failed', chalk.cyan('gcloud CLI'))}`,
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

  // Ask the user what which operating mode he wants to use
  const operatingMode = await askOperatingMode();
  if (!operatingMode) return;
  else if (operatingMode === 'standalone') await standaloneMode();
  else await serverMode();

  console.log('\n' + t('exit.bye'));
  exit();
}

main();

process.on('uncaughtException', async (error) => {
  if (error.message.includes('EPIPE')) return;
  handleError(`${error.name}\n${error.message}\n\n${error.stack}`);
});
