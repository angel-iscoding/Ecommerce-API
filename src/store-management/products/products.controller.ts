import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/config/role.decorator';
import { RoleNames } from '@/config/role-names.enum';
import { ProductDto } from '@/database/dto/product.dto';
import { Product } from '@/database/entities/product.entity';
import { DateAdderInterceptor } from '@/utils/interceptors/date-adder.interceptor';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ParamIdRequestDto } from '@/database/dto/request/param-id-request.dto';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productsService.getAllProducts();
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener los productos: ' + error.message,
      );
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    try {
      const product: Product = await this.productsService.getProductById(id);
      return product;
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener el producto: ' + error.message,
      );
    }
  }

  @Post('post')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleNames.Admin, RoleNames.Trader)
  @UseInterceptors(DateAdderInterceptor)
  async createProduct(
    @Body() product: ProductDto,
  ): Promise<{ message: string }> {
    try {
      const newProduct: Product =
        await this.productsService.createProduct(product);
      return { message: `Producto creado: ${newProduct.id}` };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo crear el producto: ' + error.message,
      );
    }
  }

  @Put('put/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleNames.Admin, RoleNames.Trader)
  async updateProduct(
    @Param() params: ParamIdRequestDto,
    @Body() product: ProductDto,
  ): Promise<{ message: string }> {
    try {
      const updatedProduct: Product = await this.productsService.updateProduct(
        params.id,
        product,
      );
      return { message: `Producto actualizado: ${updatedProduct.id}` };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo actualizar el producto: ' + error.message,
      );
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseInterceptors(DateAdderInterceptor)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleNames.Admin, RoleNames.Trader)
  async deleteProduct(
    @Param() params: ParamIdRequestDto,
  ): Promise<{ message: string }> {
    try {
      await this.productsService.deleteProduct(params.id);
      return { message: 'Producto eliminado correctamente' };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo eliminar el producto: ' + error.message,
      );
    }
  }
}
