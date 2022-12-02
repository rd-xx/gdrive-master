import { JsonConfig } from '../utils/types.js';
import fsExtra from 'fs-extra';

const { readJson, writeJson, pathExists } = fsExtra; // Throws an error if I don't do this.

export async function isFirstTime(): Promise<boolean> {
  const configExists = await pathExists('./config.json');
  if (!configExists) return true;

  const config = await getConfig();
  if (!config.apiToken) return true;
  else return false;
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

export async function updateConfig({
  verbose,
  debug,
  apiToken
}: Partial<JsonConfig>): Promise<JsonConfig> {
  const config = await getConfig();
  config.verbose = verbose || config.verbose || false;
  config.debug = debug || config.debug || false;
  config.apiToken = apiToken || config.apiToken || null;

  await writeConfig(config);
  return config;
}
