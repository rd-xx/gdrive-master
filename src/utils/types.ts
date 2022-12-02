export type Config = {
  complementsToken: string;
};

export type OperatingMode = 'standalone' | 'server';
export type WorkingMode = 'auto' | 'manual';

export type JsonConfig = {
  debug: boolean;
  verbose: boolean;
  apiToken: string | null;
};
