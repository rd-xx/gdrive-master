import { WorkingMode } from '../types/miscellaneous.types';
import prompts from 'prompts';
import i18n from 'i18n';

/**
 * Asks the user which working mode he wants to use.
 * Either automatic or manual.
 *
 * @returns Working mode as a string.
 */
export async function askWorkingMode(): Promise<WorkingMode> {
  const response = await prompts({
    type: 'select',
    choices: [
      {
        title: i18n.__('workingModeAuto'),
        value: 'auto',
        description: i18n.__('prompts.workingMode.autoDescription')
      },
      {
        title: i18n.__('workingModeManual'),
        value: 'manual',
        description: i18n.__('prompts.workingMode.manualDescription')
      }
    ],
    name: 'mode',
    message: i18n.__('prompts.workingMode.message')
  });

  return response.mode;
}

export async function askKeysQuantity(): Promise<number> {
  const response = await prompts({
    type: 'number',
    name: 'quantity',
    message: i18n.__('prompts.keys.message')
  });

  return response.quantity;
}
