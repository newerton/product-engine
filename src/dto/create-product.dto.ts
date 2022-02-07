export class CreateProductDto {
  title: string;
  description: string;
  price: number;
  discount_percentage: number;
  warranty: string;
  available: boolean;
}

export class KafkaCreateProductDto {
  value: CreateProductDto;
}
