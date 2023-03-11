import { randomBytes } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { unlink } from 'fs/promises';
import * as mime from 'mime';
import { TFile } from '../types/file.type';

export function generateFilePath(): string {
  const base =
    randomBytes(4)
      .toString('hex')
      .match(/.{1,2}/g) ?? ([] as string[]);
  const finalDest = ('./uploads/' + base.join('/')) as string;

  if (!existsSync(finalDest)) {
    mkdirSync(finalDest, { recursive: true });
  }

  return finalDest;
}

export function generateFileName(
  _: unknown,
  file: TFile,
  callback: (error: Error | null, filename: string) => void,
) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;

  while (counter < 16) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  callback(null, `${result}.${mime.getExtension(file.mimetype)}`);
}

export async function deleteFile(path: string) {
  if (existsSync(path)) {
    await unlink(path);
  }
}
