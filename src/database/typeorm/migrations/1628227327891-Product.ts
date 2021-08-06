import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Product1628227327891 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            default: null,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
