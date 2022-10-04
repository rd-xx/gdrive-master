import { writeFile } from 'fs-extra';
import i18n from 'i18n';
import chalk from 'chalk';

export function welcomeUser(): void {
  console.clear();
  console.log(chalk.gray.bold('gdrive-master » 0.0.1') + '\n');
}

export function handleError(stacktrace: string): void {
  console.log(chalk.red.bold(i18n.__('errorUnexpected')));
  console.log(i18n.__('errorStacktrace'));

  writeFile('stacktrace.txt', stacktrace, (err) => {
    if (err) {
      console.log(i18n.__('errorNoStacktrace'));
      console.log(stacktrace);
      console.log('\n');
      console.log(err);
      return;
    }
  });
}
