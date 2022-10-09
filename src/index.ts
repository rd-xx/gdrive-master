import { printSettings, welcomeUser } from './helper/stdout.helper';
import { join, normalize } from 'path';
import chalk from 'chalk';
import i18n from 'i18n';
import {
  askProjectCreation,
  askWorkingMode,
  askProjectId
} from './helper/prompts.helper';
import {
  isGcloudInstalled,
  createProject,
  setProject
} from './helper/gcloud.helper';

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

  // Ask the user what which working mode he wants to use
  const workingMode = await askWorkingMode();
  welcomeUser();
  printSettings(workingMode);

  // Set the working project on glcoud
  if (workingMode === 'auto') {
    const projectId = createProject();
    if (!projectId) return;
    setProject(projectId);
  } else {
    let projectId = '';

    const shouldCreateNewProject = await askProjectCreation();
    if (shouldCreateNewProject) {
      projectId = createProject() || '';
      if (!projectId) return;
      setProject(projectId);
    } else {
      let isProjectIdValid = false;

      while (!isProjectIdValid) {
        const projectId = await askProjectId(),
          settedProject = setProject(projectId);

        if (settedProject) isProjectIdValid = true;
        else console.log('[❌]', i18n.__('prompts.project.id.invalid') + '\n');
      }
    }
  }

  // Create the project
  // const projectId = createProject();
  // console.log('saiiiiiii');
}

main();
