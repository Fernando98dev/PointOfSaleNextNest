import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../categories/entities/category.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 60 })
    name!: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: 'default.jpg' })
    image?: string;

    @Column({ type: 'decimal' })
    price!: number;

    @Column({ type: 'int' })
    inventory!: number;

    @ManyToOne(() => Category, category => category.products)
    category!: Category;

}
