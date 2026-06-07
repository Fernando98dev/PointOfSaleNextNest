import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { CategoriesModule } from '../categories/categories.module';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: typeOrmConfig,
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Product, Category]),
        CategoriesModule,
        ProductsModule,

    ],
    providers: [SeederService],
})
export class SeederModule { }
