import { UsageMode } from '../types/miscellaneous.types';
import prompts from 'prompts';

export async function askMode(): Promise<UsageMode> {
  const response = await prompts({
    type: 'select',
    choices: [
      { title: 'Download', value: 'standalone' },
      { title: 'Upload', value: 'autouploader' }
    ],
    name: 'mode',
    message: 'What would you like to do?'
  });

  return response.mode;
}
