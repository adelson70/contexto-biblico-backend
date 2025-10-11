import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

/**
 * Decorator para documentar resposta padrão da API no Swagger
 */
export const ApiStandardResponse = <TModel extends Type<any>>(
  status: number,
  description: string,
  dataType?: TModel,
  isArray = false,
) => {
  const decorators: Array<MethodDecorator | ClassDecorator> = [];

  if (dataType) {
    decorators.push(ApiExtraModels(dataType));
  }

  const schema: any = {
    type: 'object',
    properties: {
      status: {
        type: 'number',
        example: status,
        description: 'Código de status HTTP',
      },
      message: {
        type: 'string',
        example: description,
        description: 'Mensagem descritiva da resposta',
      },
      data: dataType
        ? isArray
          ? {
              type: 'array',
              items: { $ref: getSchemaPath(dataType) },
            }
          : { $ref: getSchemaPath(dataType) }
        : {
            type: 'object',
            nullable: true,
            description: 'Dados adicionais da resposta',
          },
    },
  };

  decorators.push(
    ApiResponse({
      status,
      description,
      schema,
    }),
  );

  return applyDecorators(...decorators);
};

/**
 * Decorator para documentar resposta de erro no Swagger
 */
export const ApiErrorResponse = (
  status: number,
  description: string,
  example?: any,
) => {
  const schema: any = {
    type: 'object',
    properties: {
      status: {
        type: 'number',
        example: status,
        description: 'Código de status HTTP',
      },
      message: {
        type: 'string',
        example: description,
        description: 'Mensagem de erro',
      },
      data: {
        type: 'object',
        nullable: true,
        description: 'Dados adicionais do erro',
        example: example || null,
      },
    },
  };

  return ApiResponse({
    status,
    description,
    schema,
  });
};

