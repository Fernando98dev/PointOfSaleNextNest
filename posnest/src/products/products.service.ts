import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>

  ) {
  }
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({ id: createProductDto.categoryId });
    if (!category) {
      let errors: string[] = [];
      errors.push('Category not found');
      throw new NotFoundException(errors);
    }

    return await this.productRepository.save({ ...createProductDto, category });
  }

  async findAll(categoryId?: number | null, take?: number, skip?: number) {
    const [data, total] = await this.productRepository.findAndCount(
      {
        relations: { category: true },
        order: { id: 'DESC' },
        where: categoryId ? { category: { id: categoryId } } : {},
        take,
        skip
      }
    );
    return { data, total };
  }

  findOne(id: number) {
    const product = this.productRepository.findOne({ where: { id }, relations: { category: true } });
    if (!product) {
      let errors: string[] = [];
      errors.push('Product not found');
      throw new NotFoundException(errors);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) {
      let errors: string[] = [];
      errors.push('Product not found');
      throw new NotFoundException(errors);
    }

    Object.assign(product!, updateProductDto);

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: updateProductDto.categoryId });
      if (!category) {
        let errors: string[] = [];
        errors.push('Category not found');
        throw new NotFoundException(errors);
      }
      product.category = category;
    }

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      let errors: string[] = [];
      errors.push('Product not found');
      throw new NotFoundException(errors);
    }

    await this.productRepository.remove(product);
    return { message: 'Product removed successfully' };

  }
}
