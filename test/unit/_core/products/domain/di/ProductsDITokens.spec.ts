import { ProductsDITokens } from '@core/products/domain/di';

describe('ProductsDITokens', () => {
  test('Should validate the ProductsRepository Symbol', () => {
    const repository = ProductsDITokens.ProductsRepository.toString();
    expect(repository).toEqual(Symbol.for('ProductsRepository').toString());
  });
});
