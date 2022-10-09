import { WorkingMode } from '../types/miscellaneous.types';
import prompts from 'prompts';
import i18n from 'i18n';

/**
 * Asks the user which working mode he wants to use.
 * Either automatic or manual.
 *
 * @returns Working mode as a string or undefined if the user cancelled the operation.
 */
export async function askWorkingMode(): Promise<WorkingMode | undefined> {
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

/**
 * Asks the user if he wants to create a new project.
 * If not, we should ask him for the project Id.
 *
 * @returns True if he wants to create project, false if not or undefined if the user cancelled the operation.
 */
export async function askProjectCreation(): Promise<boolean | undefined> {
  const response = await prompts({
    type: 'confirm',
    name: 'create',
    message: i18n.__('prompts.project.message')
  });

  return response.create;
}

/**
 * Asks the user for the project Id.
 *
 * @returns Project Id as a string or undefined if the user cancelled the operation.
 */
export async function askProjectId(): Promise<string | undefined> {
  const response = await prompts({
    type: 'text',
    name: 'id',
    message: i18n.__('prompts.project.id.message')
  });

  return response.id;
}

/**
 * Asks the user how many keys he wants to create.
 *
 * @returns Number of keys to generate or undefined if the user cancelled the operation.
 */
export async function askKeysQuantity(): Promise<number | undefined> {
  const response = await prompts({
    type: 'number',
    name: 'quantity',
    message: i18n.__('prompts.keys.message')
  });

  return response.quantity;
}
