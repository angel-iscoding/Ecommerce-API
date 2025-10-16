import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/config/role.decorator';
import { Role } from '@/config/role.enum';
import { ProductDto } from '@/database/products/product.dto';
import { Product } from '@/database/products/product.entity';
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
import { IsUUID } from 'class-validator';
import { ProductsService } from './product.service';

class ProductIdParam {
  @ApiProperty({
    description: 'UUID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;
}

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
  async getProductById(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const product: Product = await this.productsService.getProductById(id);
      return { message: `Producto: ${product}` };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener el producto: ' + error.message,
      );
    }
  }

  @Post('post')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin, Role.Trader)
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

  @Post('seeder')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin, Role.Trader)
  @ApiBearerAuth()
  async seederProducts() {
    if ((await this.productsService.getAllProducts()).length) {
      throw new InternalServerErrorException(
        'Solo usar cuando los productos estén vacíos',
      );
    }
    await this.productsService.preloadProducts();
    return '¡Precarga realizada con éxito!';
  }

  @Put('put/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Trader)
  async updateProduct(
    @Param() params: ProductIdParam,
    @Body() product: ProductDto,
  ): Promise<{ message: string }> {
    try {
      const updatedProduct: Product = await this.productsService.updateProduct(
        params.id,
        product,
      );
      return { message: `Producto: ${updatedProduct}` };
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
  @Roles(Role.Admin, Role.Trader)
  async deleteProduct(
    @Param() params: ProductIdParam,
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
