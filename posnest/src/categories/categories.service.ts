import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();
    category.name = createCategoryDto.name;
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number, products?: string) {
    const options: FindManyOptions<Category> = {
      where: { id },

    }

    if (products === 'true') {
      options.relations = {
        products: true
      },
        options.order = {
          id: 'DESC'
        }
    }


    const category = await this.categoryRepository.findOne(options);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {

    const category = await this.findOne(id);
    category.name = updateCategoryDto.name;
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return { message: 'Category removed successfully' };
  }
}
