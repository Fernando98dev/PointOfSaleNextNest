import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { categories } from './data/categories';
import { products } from './data/products';

@Injectable()
export class SeederService {

    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        private datasource: DataSource
    ) { }

    async onModuleInit() {
        const connection = this.datasource;
        await connection.dropDatabase();
        await connection.synchronize();
        await this.seed();
    }

    async seed() {
        await this.categoryRepository.save(categories);
        for await (const seedProducts of products) {
            const category = await this.categoryRepository.findOneBy({ id: seedProducts.categoryId });
            const product = new Product();
            product.name = seedProducts.name;
            product.image = seedProducts.image;
            product.price = seedProducts.price;
            product.inventory = seedProducts.inventory;
            product.category = category!;
            await this.productRepository.save(product);
        }
        console.log('Seed executed...');
    }
}