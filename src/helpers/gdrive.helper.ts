import { DriveStorage } from '../utils/types.js';
import { google, drive_v3 } from 'googleapis';
import { join } from 'path';

export function gdriveLogin() {
  const KEYFILEPATH = join(globalThis.paths.root, 'key.json'),
    SCOPES = ['https://www.googleapis.com/auth/drive'],
    auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES
    }),
    driveService = google.drive({ version: 'v3', auth });

  return driveService;
}

export async function getAvailableSpace(
  instance: drive_v3.Drive
): Promise<DriveStorage> {
  const space = await instance.about.get({
    fields: 'storageQuota'
  });

  return space.data.storageQuota as DriveStorage;
}
