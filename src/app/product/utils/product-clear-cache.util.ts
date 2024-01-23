import { Cache } from 'cache-manager';

import { PRODUCTS_KEY } from '@app/@common/application/cache/cache.contant';

export const productClearCache = async (cacheManager: Cache) => {
  const keys: string[] = await cacheManager.store.keys();
  keys.forEach((key) => {
    if (key.startsWith(PRODUCTS_KEY)) {
      cacheManager.del(key);
    }
  });
};
