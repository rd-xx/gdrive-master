import { WorkingMode } from '../types/miscellaneous.types';
import { KEYS_QUANTITY } from '../utils/constants';
import { writeFile } from 'fs-extra';
import chalk from 'chalk';
import i18n from 'i18n';

export function welcomeUser(): void {
  console.clear();
  console.log(chalk.gray.bold('gdrive-master » 0.0.1') + '\n');
}

export function printSettings(workingMode: WorkingMode): void {
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
