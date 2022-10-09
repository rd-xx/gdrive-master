import { writeFile } from 'fs-extra';
import chalk from 'chalk';
import i18n from 'i18n';

export function welcomeUser(): void {
  console.clear();
  console.log(chalk.gray.bold('gdrive-master » 0.0.1') + '\n');
}

export function handleError(stacktrace: string): void {
  console.log(chalk.red.bold(i18n.__('errors.unexpected')));
  console.log(i18n.__('errors.stacktrace'));

  writeFile('stacktrace.txt', stacktrace, (err) => {
    if (err) {
      console.log(i18n.__('errors.noStacktrace'));
      console.log(stacktrace);
      console.log('\n');
      console.log(err);
      return;
    }
  });
}
