import { ApiProperty } from '@nestjs/swagger';

export class ProductCreateInputDto {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'number' })
  price: number;

  @ApiProperty({ type: 'string' })
  discount_percentage: number;

  @ApiProperty({ type: 'string' })
  warranty: string;

  @ApiProperty({ type: 'boolean' })
  available: boolean;
}

export class ProductCreateOutputDto {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'number' })
  price: number;

  @ApiProperty({ type: 'number' })
  discount_percentage: number;

  @ApiProperty({ type: 'string' })
  warranty: string;

  @ApiProperty({ type: 'boolean' })
  available: boolean;

  @ApiProperty({ type: 'date' })
  created_at: Date;

  @ApiProperty({ type: 'date' })
  updated_at: Date;

  @ApiProperty({ type: 'date' })
  deleted_at: Date | null;
}
