export type OperatingMode = 'standalone' | 'server';
export type WorkingMode = 'auto' | 'manual';

export type JsonConfig = {
  debug: boolean;
  verbose: boolean;
  apiToken: string | null;
};

export interface ApiResponse {
  statusCode: number;
  statusLabel: 'OK' | 'RETRY' | 'ERROR';
}

export type ApiUpdate = ApiResponse & {
  data: {
    version: string;
    downloadLink: string;
  };
};

export type ApiCheckEmail = ApiResponse & {
  data: boolean;
};
