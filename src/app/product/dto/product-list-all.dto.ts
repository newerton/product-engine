import { ApiProperty } from '@nestjs/swagger';

import { GetOneProductsOutputDto } from './product-get-one.dto';

export class ListAllProductsPagedOutputDto {
  @ApiProperty({ type: [GetOneProductsOutputDto] })
  data: GetOneProductsOutputDto[];

  @ApiProperty({ type: 'number', example: 100 })
  count: number;

  @ApiProperty({ type: 'number', example: 1 })
  page: number;

  @ApiProperty({ type: 'number', example: 20 })
  limit: number;
}
