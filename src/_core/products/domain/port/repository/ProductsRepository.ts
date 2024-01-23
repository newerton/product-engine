export type ProductsRepositoryInput = {
  name: string;
  description: string;
  price: number;
  discount_percentage: number;
  warranty: string;
  available: boolean;
  status: string;
};

export type ProductsRepositoryOutput = ProductsRepositoryInput & {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type ProductsRepositoryCountOutput = {
  data: ProductsRepositoryOutput[];
  count: number;
};

export type ProductsRepositoryFilter = {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  discount_percentage?: number;
  warranty?: string;
  available?: boolean;
  status?: string;
};

export interface ProductsRepository {
  create(payload: ProductsRepositoryInput): Promise<ProductsRepositoryOutput>;
  update(
    id: string,
    payload: Partial<ProductsRepositoryInput>,
  ): Promise<ProductsRepositoryOutput>;
  delete(id: string): Promise<ProductsRepositoryOutput>;
  findOne(filter: ProductsRepositoryFilter): Promise<ProductsRepositoryOutput>;
  findAll(
    page: number,
    limit: number,
    filter: ProductsRepositoryFilter,
  ): Promise<ProductsRepositoryCountOutput>;
  findFull(
    filter: ProductsRepositoryFilter,
  ): Promise<ProductsRepositoryOutput[]>;
}
