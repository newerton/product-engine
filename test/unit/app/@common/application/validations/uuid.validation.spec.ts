import z from 'zod';

import { UUIDSchemaValidation } from '@app/@common/application/validations';

describe('UUIDSchemaValidation', () => {
  let uuidSchemaValidation: UUIDSchemaValidation;

  beforeEach(() => {
    uuidSchemaValidation = new UUIDSchemaValidation();
  });

  describe('createSchema', () => {
    it('should create a zod schema for a valid UUID string', () => {
      const schema = uuidSchemaValidation.createSchema();
      expect(schema instanceof z.Schema).toBe(true);

      const validUUID = '11111111-2222-3333-4444-555555555555';
      const invalidUUID = 'invalid-uuid-string';

      expect(() => schema.parse(validUUID)).not.toThrow();
      expect(() => schema.parse(invalidUUID)).toThrow();
    });
  });
});
