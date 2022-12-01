export type Config = {
  complementsToken: string;
};

export type OperatingMode = 'standalone' | 'server';
export type WorkingMode = 'auto' | 'manual';

export type RequestOptions = {
  method: 'GET' | 'POST';
  headers: Record<string, string>;
};
