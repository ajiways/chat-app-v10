import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function ApiFile(
  fieldName = 'file',
  required = true,
  localOptions?: MulterOptions,
  schema?: SchemaObject,
) {
  const defaultFileSchema: SchemaObject = {
    type: 'object',
    required: required ? [fieldName] : [],
    properties: {
      [fieldName]: {
        type: 'string',
        format: 'binary',
      },
    },
  };

  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: schema ? schema : defaultFileSchema,
    }),
  );
}
