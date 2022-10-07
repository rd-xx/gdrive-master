import { StandaloneMode } from '../types/miscellaneous.types';
import prompts from 'prompts';

export async function askStandaloneMode(): Promise<StandaloneMode> {
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
