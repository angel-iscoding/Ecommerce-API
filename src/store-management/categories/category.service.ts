import { Category } from '@/database/entities/category.entity';
import { CategoryDto } from '@/database/dto/category.dto';
import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './category.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepository.getCategories();
  }

  async createCategory(category: CategoryDto): Promise<Category> {
    return await this.categoriesRepository.createCategory(category);
  }

  async getById(id: number): Promise<Category | undefined> {
    return await this.categoriesRepository.findById(id);
  }

  async findByName(name: string): Promise<Category | undefined> {
    return await this.categoriesRepository.findByName(name);
  }

  async thisCategoryExist(name: string): Promise<boolean> {
    if (await this.categoriesRepository.findByName(name))
      return Promise.resolve(true);
    return Promise.resolve(false);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.categoriesRepository.deleteCategory(id);
  }
}
