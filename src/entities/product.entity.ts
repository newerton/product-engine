import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';

@Entity('products')
export class Product {
  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  @IsNumber()
  price: number;

  @Column()
  discount_percentage: number;

  @Column()
  warranty: string;

  @Column({ default: false })
  available: boolean;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @Expose({ name: 'price_with_discount' })
  getPriceWithDiscount(): number {
    if (this.price === 0 || this.discount_percentage >= 1000) {
      return 0;
    }
    const discount = this.price * (this.discount_percentage / 100);
    const total = this.price - discount;
    return total <= 0 ? 0 : total;
  }

  @BeforeInsert()
  private setCreateDate(): void {
    this.created_at = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  private setUpdateDate(): void {
    this.updated_at = new Date();
  }

  @AfterLoad()
  private convertStringToNumber() {
    this.price = parseFloat(this.price as any);
  }
}
