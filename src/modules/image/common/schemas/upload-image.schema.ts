import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { EImageType } from '../types';

export const imageUploadSchema: SchemaObject = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      format: 'binary',
      description: 'Изображение',
    },
    type: {
      enum: [EImageType.ROOM_AVATAR, EImageType.USER_AVATAR],
    },
  },
};
