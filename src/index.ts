import { isGcloudInstalled } from './helper/gcloud.helper';
import { welcomeUser } from './helper/stdout.helper';
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


  // wip
  // const loggedOut = logout();
  // if (loggedOut) return;

  // Ask for the mode
  // const mode = await askMode();
  // if (!mode) {
  //   welcomeUser();
  //   console.log('Exited.');
  //   return;
  // }
  // const mode2 = await askMode();
}

main();
