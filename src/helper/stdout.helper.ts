import { OperatingMode, WorkingMode } from '../types/miscellaneous.types.js';
import { version } from '../../package.json';
import { writeFile } from 'fs';
import chalk from 'chalk';
import i18n from 'i18n';

export function welcomeUser(): void {
  console.clear();
  console.log(chalk.gray.bold('gdrive-master »', version) + '\n');
}

export function printSettings(
  operatingMode: OperatingMode,
  workingMode: WorkingMode,
  keysQuantity: number
): void {
  console.log(
    '[🔩]',
    i18n.__('settings.operatingMode'),
    chalk.yellow(
      operatingMode === 'standalone' ? 'Standalone' : 'Auto-Uploader'
    )
  );
  console.log(
    '[⚙️]',
    i18n.__('settings.workingMode'),
    chalk.cyan(
      i18n.__('workingMode' + (workingMode === 'auto' ? 'Auto' : 'Manual'))
    )
  );
  console.log(
    '[⚙️]',
    i18n.__('settings.keys'),
    chalk.cyan(keysQuantity) + '\n'
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

export function exit(): void {
  console.log(i18n.__('exit.awaiting'));
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
}
