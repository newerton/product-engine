import * as JoiBase from 'joi';
import { PipeTransform, Injectable, HttpStatus } from '@nestjs/common';
import { CreateSchema } from '../schemas/joi.create.schema.factory';
import { JoiValidationException } from 'src/app.exceptions';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  private readonly schema: JoiBase.AnySchema;

  constructor(private schemaFactory: CreateSchema) {
    this.schema = schemaFactory.createSchema();
  }

  async transform(message: any): Promise<any> {
    try {
      await this.schema.validateAsync(message);
    } catch (err) {
      const errors = {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: JoiValidationException.name,
        message: err?.message || err,
        details: err?.details,
      };
      throw new JoiValidationException(errors);
    }

    return message;
  }
}
