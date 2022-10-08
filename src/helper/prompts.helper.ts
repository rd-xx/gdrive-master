import { WorkingMode } from '../types/miscellaneous.types';
import prompts from 'prompts';

export async function askWorkingMode(): Promise<WorkingMode> {
  const response = await prompts({
    type: 'select',
    choices: [
      {
        title: 'Automático',
        value: 'standalone',
        description: 'Cria o projeto e 100 chaves automaticamente.'
      },
      {
        title: 'Manual',
        value: 'autouploader',
        description: 'Pergunta o que fazer a cada etapa.'
      }
    ],
    name: 'mode',
    message: 'Qual modo você deseja utilizar?'
  });

  return response.mode;
}

export async function askKeysQuantity(): Promise<number> {
  const response = await prompts({
    type: 'number',
    name: 'quantity',
    message: 'Quantas chaves você deseja criar?'
  });

  return response.quantity;
}
