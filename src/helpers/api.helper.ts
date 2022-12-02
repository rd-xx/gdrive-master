import { ApiUpdate, ApiCheckEmail } from '../utils/types.js';
import axios from 'axios';

export async function getLatestUpdate(): Promise<ApiUpdate> {
  const request = await axios.get('update/gdm');
  return request.data;
}

export async function checkEmail(email: string): Promise<ApiCheckEmail> {
  const request = await axios.get(`gdrive/check/${email}`);
  return request.data;
}

export async function addAccount(
  email: string,
  serviceAccount: Record<string, string>,
  keys: string[]
): Promise<unknown> {
  const request = await axios.post('gdrive/add', {
    email,
    serviceAccount,
    keys
  });
  return request.data;
}
