import { ApiProperty } from '@nestjs/swagger';

export class ProductUpdateInputDto {
  @ApiProperty({ type: 'string' })
  id?: string;

  @ApiProperty({ type: 'string' })
  name?: string;

  @ApiProperty({ type: 'string' })
  description?: string;

  @ApiProperty({ type: 'number' })
  price?: number;

  @ApiProperty({ type: 'number' })
  discount_percentage?: number;

  @ApiProperty({ type: 'string' })
  warranty?: string;

  @ApiProperty({ type: 'boolean' })
  available?: boolean;

  @ApiProperty({ type: 'string' })
  status?: string;
}
