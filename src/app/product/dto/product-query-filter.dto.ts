import { ApiProperty } from '@nestjs/swagger';

export class ProductsQueryFiltersDto {
  @ApiProperty({ name: 'filter[id]', type: 'string', required: false })
  id: string;

  @ApiProperty({ name: 'filter[name]', type: 'string', required: false })
  name: string;

  @ApiProperty({ name: 'filter[description]', type: 'string', required: false })
  description: string;

  @ApiProperty({ name: 'filter[price]', type: 'number', required: false })
  price: number;

  @ApiProperty({
    name: 'filter[discount_percentage]',
    type: 'number',
    required: false,
  })
  discount_percentage: number;

  @ApiProperty({ name: 'filter[warranty]', type: 'string', required: false })
  warranty: string;

  @ApiProperty({ name: 'filter[available]', type: 'boolean', required: false })
  available: boolean;
}
