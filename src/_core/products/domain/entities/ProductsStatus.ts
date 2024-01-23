export enum ProductsStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export type ProductsStatus =
  (typeof ProductsStatusEnum)[keyof typeof ProductsStatusEnum];
