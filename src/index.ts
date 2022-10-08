import { createProject, isGcloudInstalled } from './helper/gcloud.helper';
import { WorkingMode } from './types/miscellaneous.types';
import { welcomeUser } from './helper/stdout.helper';
import { KEYS_QUANTITY } from './utils/constants';
import { join, normalize } from 'path';
import { I18n } from 'i18n';
import chalk from 'chalk';

// Setup i18n
const i18n = new I18n({
    locales: ['en', 'fr', 'pt'],
    directory: normalize(join(__dirname, '..', 'locales'))
  }),
  locale = Intl.DateTimeFormat().resolvedOptions().locale;

if (locale.includes('pt')) i18n.setLocale('fr');
else if (locale.includes('pt')) i18n.setLocale('pt');
else i18n.setLocale('en');

// Print the project name + version
welcomeUser();

async function main() {
  // Checking if gcloud is installed
  console.log('[🔨] ' + i18n.__('gcloudCheck', chalk.cyan('gcloud CLI')));
  const hasGcloud = isGcloudInstalled();
  if (!hasGcloud) {
    console.log(
      '[❌] ' + i18n.__('gcloudNotInstalled', chalk.cyan('gcloud CLI'))
    );
    return;
  }
  console.log(
    '[🔨] ' + i18n.__('gcloudInstalled', chalk.cyan('gcloud CLI')) + '\n'
  );

  // Log out from all accounts & log in again
  // logout();
  // login();

  // Ask the user what does he want to do
  // const workingMode = await askWorkingMode();
  const workingMode: WorkingMode = 'auto';

  welcomeUser();
  console.log(
    '[🔩] ' + i18n.__('settingsOperatingMode') + chalk.yellow('Standalone')
  );
  console.log(
    '[⚙️] ' +
      i18n.__('settingsWorkingMode') +
      i18n.__('workingMode' + (workingMode === 'auto' ? 'Auto' : 'Manual'))
  );
  console.log(
    '[⚙️] ' + i18n.__('settingsKeys') + chalk.cyan(KEYS_QUANTITY) + '\n'
  );

  // Create the project
  const projectId = createProject();
  console.log('saiiiiiii');
}

main();
