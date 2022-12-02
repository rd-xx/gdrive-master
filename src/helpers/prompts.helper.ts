import { OperatingMode, WorkingMode } from '../utils/types.js';
import { setProject } from './gcloud.helper.js';
import { isTokenValid } from './api.helper.js';
import prompts from 'prompts';
import i18n from 'i18n';

/**
 * Asks the user which operating mode he wants to use.
 * Either standalone or server.
 *
 * @returns {Promise<OperatingMode | undefined>} the operating mode selected by the user or undefined if the user canceled the operation.
 */
export async function askOperatingMode(): Promise<OperatingMode | undefined> {
  const response = await prompts({
    type: 'select',
    name: 'value',
    message: i18n.__('prompts.operatingMode.message'),
    choices: [
      {
        title: i18n.__('operatingMode.standalone'),
        description: i18n.__('prompts.operatingMode.standaloneDescription'),
        value: 'standalone'
      },
      {
        title: i18n.__('operatingMode.server'),
        description: i18n.__('prompts.operatingMode.serverDescription'),
        value: 'server'
      }
    ]
  });

  return response.value;
}

/**
 * Asks the user which working mode he wants to use.
 * Either automatic or manual.
 *
 * @returns {Promise<WorkingMode | undefined>} the working mode or undefined if the user cancelled the operation.
 */
export async function askWorkingMode(): Promise<WorkingMode | undefined> {
  const response = await prompts({
    type: 'select',
    name: 'mode',
    message: i18n.__('prompts.workingMode.message'),
    choices: [
      {
        title: i18n.__('workingMode.auto'),
        description: i18n.__('prompts.workingMode.autoDescription'),
        value: 'auto'
      },
      {
        title: i18n.__('workingMode.manual'),
        description: i18n.__('prompts.workingMode.manualDescription'),
        value: 'manual'
      }
    ]
  });

  return response.mode;
}

/**
 * Asks the user if he wants to create a new project.
 * If not, we should ask him for the project Id.
 *
 * @returns {Promise<boolean | undefined>} true if the user wants to create a new project, false if not or undefined if he cancelled the operation.
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
 * @returns {Promise<string | undefined>} project Id as a string or undefined if the user cancelled the operation.
 */
export async function askProjectId(): Promise<string | undefined> {
  const response = await prompts({
    type: 'text',
    name: 'id',
    message: i18n.__('prompts.project.id.message'),
    validate: async (value: string) => {
      const settedProject = await setProject(value);
      if (settedProject) return true;
      else return i18n.__('prompts.project.id.invalid');
    }
  });

  return response.id;
}

/**
 * Asks the user how many keys he wants to create.
 *
 * @returns {Promise<number | undefined>} number of keys to generate or undefined if the user cancelled the operation.
 */
export async function askKeysQuantity(): Promise<number | undefined> {
  const response = await prompts({
    type: 'number',
    name: 'quantity',
    message: i18n.__('prompts.keys.message'),
    validate: (value: number) => {
      if (value > 0) return true;
      else return i18n.__('prompts.keys.notPositive');
    }
  });

  return response.quantity;
}

/**
 * Asks the user if he wants to create a new file with all the created keys.
 *
 * @returns {Promise<boolean | undefined>} true if the user wants to save the created keys in a new file, false if not or undefined if he cancelled the operation.
 */
export async function askSaveKeys(): Promise<boolean | undefined> {
  const response = await prompts({
    type: 'confirm',
    name: 'save',
    message: i18n.__('prompts.keys.save.message')
  });

  return response.save;
}

/**
 * Asks the user for his API token.
 *
 * @returns {Promise<string | undefined>} token as a string or undefined if the user cancelled the operation.
 */
export async function askApiToken(): Promise<string | undefined> {
  const response = await prompts({
    type: 'text',
    name: 'token',
    message: i18n.__('prompts.apiToken.message'),
    validate: async (value: string) => {
      if (value.length < 0) return i18n.__('prompts.apiToken.invalid');

      const apiResponse = await isTokenValid(value);
      if (apiResponse) return true;
      else return i18n.__('prompts.apiToken.invalid');
    }
  });

  return response.token;
}
