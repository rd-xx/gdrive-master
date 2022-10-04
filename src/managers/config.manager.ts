import { readJson, writeJson } from 'fs-extra';

export default class ConfigManager {
  // Absolute path to the config file
  location: string;
  firstTime: boolean | undefined;
  complementsToken: string | undefined;

  constructor(configPath: string) {
    this.location = configPath;
  }

  // Load the config file and set the properties
  async load() {
    const configFile = await readJson(this.location, { throws: false });
    if (!configFile) {
      this.firstTime = true;
      return;
    }

    if (configFile.complementsToken)
      this.complementsToken = configFile.complementsToken;
  }

  // Create the config file
  async create() {
    await writeJson(this.location, {
      complementsToken: this.complementsToken || ''
    });
  }
}
