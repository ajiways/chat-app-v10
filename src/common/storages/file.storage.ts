import { Request } from 'express';
import { diskStorage } from 'multer';
import { generateFilePath, generateFileName } from '../helpers/file.helper';
import { TFile } from '../types/file.type';

export const fileStorage = diskStorage({
  destination: (_: Request, __: TFile, callback) => {
    callback(null, generateFilePath());
  },
  filename: generateFileName,
});
