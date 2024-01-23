import { PRODUCTS_KEY } from '@app/@common/application/cache/cache.contant';

describe('cache contant', () => {
  it('should be defined', () => {
    expect(PRODUCTS_KEY).toBeDefined();
  });

  it('should be equal', () => {
    expect(PRODUCTS_KEY).toEqual('/products');
  });
});
