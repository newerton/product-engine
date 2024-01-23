import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';

describe('Exception', () => {
  describe('constructor', () => {
    test('When input wrong code, expect it creates Exception instance with default parameters', () => {
      const exception: Exception<void> = Exception.new({
        code: 1981,
      });
      expect(exception.code).toBe(Code.INTERNAL_SERVER_ERROR.code);
      expect(exception.error).toBe(Code.INTERNAL_SERVER_ERROR.message);
      expect(exception.message).toBe('Status code not found');
      expect(exception.data).toBeUndefined();
    });
  });

  describe('new', () => {
    test('When input data & overrideMessage args are empty, expect it creates Exception instance with default parameters', () => {
      const exception: Exception<void> = Exception.new({
        code: Code.BAD_REQUEST.code,
      });

      expect(exception.code).toBe(Code.BAD_REQUEST.code);
      expect(exception.message).toBe(Code.BAD_REQUEST.message);
      expect(exception.data).toBeUndefined();
    });

    test('When input data & overrideMessage args are set, expect it creates Exception instance with custom parameters', () => {
      const customMessage = 'Custom Internal server error';
      const customData: Record<string, unknown> = {
        result: 'Custom Internal server error',
      };

      const exception: Exception<Record<string, unknown>> = Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: customMessage,
        data: customData,
      });

      expect(exception.code).toBe(Code.BAD_REQUEST.code);
      expect(exception.message).toBe(customMessage);
      expect(exception.data).toEqual(customData);
    });
  });
});
