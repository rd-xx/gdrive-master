import { WorkingMode } from '../types/miscellaneous.types';
import prompts from 'prompts';
import i18n from 'i18n';

export async function askWorkingMode(): Promise<WorkingMode> {
  const response = await prompts({
    type: 'select',
    choices: [
      {
        title: i18n.__('workingModeAuto'),
        value: 'auto',
        description: i18n.__('workingModeAutoDescription')
      },
      {
        title: i18n.__('workingModeManual'),
        value: 'manual',
        description: i18n.__('workingModeManualDescription')
      }
    ],
    name: 'mode',
    message: i18n.__('workingModeQuestion')
  });

  return response.mode;
}

export async function askKeysQuantity(): Promise<number> {
  const response = await prompts({
    type: 'number',
    name: 'quantity',
    message: i18n.__('promptsKeysMessage')
  });

  return response.quantity;
}
