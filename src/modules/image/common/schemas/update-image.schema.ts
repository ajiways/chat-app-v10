import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const updateImageSchema: SchemaObject = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      format: 'binary',
      description: 'Изображение',
    },
  },
};
