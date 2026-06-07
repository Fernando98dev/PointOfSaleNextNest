import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total!: number;

    @Column({ type: 'varchar', length: 60, nullable: true })
    coupon?: string;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    discount?: number;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    transactionDate!: Date;

    @OneToMany(() => TransactionContent, transaction => transaction.transaction)
    contents!: TransactionContent[];
}

@Entity()
export class TransactionContent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('int')
    quantity!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @ManyToOne(() => Product, product => product.id, { eager: true, cascade: true })
    product!: Product;

    @ManyToOne(() => Transaction, transaction => transaction.contents, { cascade: true })
    transaction!: Transaction;
}
