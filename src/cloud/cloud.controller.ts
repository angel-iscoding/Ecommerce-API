import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { CloudService } from './cloud.service';
import { ProductsService } from '../store-management/products/product.service';
import { FileValidationPipe } from '../utils/pipes/file-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class CloudController {
  constructor(
    private readonly cloudService: CloudService,
    private readonly productsService: ProductsService,
  ) {}

  @Post('uploadImage/:id')
  @ApiOperation({ summary: 'Upload product image' })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Product ID' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    const imageUrl = await this.cloudService.uploadImage(file);
    await this.productsService.updateProductImage(productId, imageUrl);
    return { imageUrl };
  }
}
