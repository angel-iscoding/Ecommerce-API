import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/config/role.decorator';
import { RoleNames } from '@/config/role-names.enum';
import { Category } from '@/database/entities/category.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './category.service';
import { CategoryDto } from '@/database/dto/category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoriesService.getCategories();
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo obtener las categorias: ' + error.message,
      );
    }
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number): Promise<Category> {
    try {
      const category: Category = await this.categoriesService.getById(id);
      return category;
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo obtener la categoria: ' + error.message,
      );
    }
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleNames.Admin)
  async createCategory(
    @Body() createCategoryDto: CategoryDto,
  ): Promise<{ message: string }> {
    try {
      if (
        await this.categoriesService.thisCategoryExist(createCategoryDto.name)
      )
        throw new InternalServerErrorException('Esta categoria ya existe');
      const category: Category =
        await this.categoriesService.createCategory(createCategoryDto);
      return { message: `Nueva categoria creada: ${category}` };
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo crear la categoria: ' + error.message,
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(RoleNames.Admin)
  async deleteCategory(@Param('id') id: number): Promise<{ message: string }> {
    try {
      if (!(await this.categoriesService.getById(id)))
        throw new InternalServerErrorException('Esta categoria no existe');
      await this.categoriesService.deleteCategory(id);
      return { message: `Categoria eliminada correctamente` };
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo eliminar la categoria: ' + error.message,
      );
    }
  }
}
