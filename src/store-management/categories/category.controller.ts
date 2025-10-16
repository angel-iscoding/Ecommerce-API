import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/config/role.decorator';
import { Role } from '@/config/role.enum';
import { Category } from '@/database/categories/category.entity';
import { CreateCategoryDto } from '@/database/categories/createCategoryDto';
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
  async getCategoryById(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const category: Category = await this.categoriesService.getById(id);
      return { message: `Category: ${category}` };
    } catch (error) {
      throw new InternalServerErrorException(
        'No se pudo obtener la categoria: ' + error.message,
      );
    }
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
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
  @Roles(Role.Admin)
  async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
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

  @Post('seeder')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  async seederCategories() {
    if ((await this.categoriesService.getCategories()).length)
      throw new InternalServerErrorException(
        'Solo usar cuando las categorias esten vacias',
      );

    await this.categoriesService.preloadCategories();

    return '¡Precarga realizada con exito!';
  }
}
