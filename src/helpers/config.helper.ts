import { JsonConfig } from '../utils/types.js';
import fsExtra from 'fs-extra';

const { readJson, writeJson, pathExists } = fsExtra; // Throws an error if I don't do this.

export async function isFirstTime(): Promise<boolean> {
  return !(await pathExists(globalThis.paths.config));
}

export async function writeConfig(config: JsonConfig): Promise<JsonConfig> {
  await writeJson(globalThis.paths.config, config, { spaces: 2 });
  return config;
}

export async function getConfig(): Promise<JsonConfig> {
  try {
    return await readJson(globalThis.paths.config);
  } catch (err) {
    console.log(err);
    throw new Error('Error reading config file');
  }
}

export async function updateConfig(
  verbose?: boolean,
  debug?: boolean,
  apiToken?: string
): Promise<JsonConfig> {
  const config = await getConfig();
  config.verbose = verbose || config.verbose || false;
  config.debug = debug || config.debug || false;
  config.apiToken = apiToken || config.apiToken || null;

  await writeConfig(config);
  return config;
}
