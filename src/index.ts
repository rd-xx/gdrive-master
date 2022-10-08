import { askProjectId, askWorkingMode } from './helper/prompts.helper';
import { welcomeUser } from './helper/stdout.helper';
import { KEYS_QUANTITY } from './utils/constants';
import { join, normalize } from 'path';
import i18n from 'i18n';
import chalk from 'chalk';

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
  console.log('[🔨]', i18n.__('gcloud.check', chalk.cyan('gcloud CLI')));
  const hasGcloud = isGcloudInstalled();
  if (!hasGcloud) {
    console.log(
      '[❌]',
      i18n.__('gcloud.notInstalled', chalk.cyan('gcloud CLI'))
    );
    return;
  }
  console.log(
    '[🔨]',
    i18n.__('gcloud.installed', chalk.cyan('gcloud CLI')) + '\n'
  );

  // logout();
  // login();

  // Ask the user what does he want to do
  // const workingMode = await askWorkingMode();
  const workingMode: WorkingMode = 'auto';

  welcomeUser();
  console.log(
    '[🔩]',
    i18n.__('settings.operatingMode'),
    chalk.yellow('Standalone')
  );
  console.log(
    '[⚙️]',
    i18n.__('settings.workingMode'),
    i18n.__('workingMode' + (workingMode === 'auto' ? 'Auto' : 'Manual'))
  );
  console.log(
    '[⚙️] ',
    i18n.__('settings.keys'),
    chalk.cyan(KEYS_QUANTITY) + '\n'
  );

  // Create the project
  const projectId = createProject();
  console.log('saiiiiiii');
}

main();
