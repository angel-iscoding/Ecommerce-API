import { ProductDto } from '@/database/dto/product.dto';
import { Product } from '@/database/entities/product.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productsRepository.getAllProducts();
  }

  async getProductById(id: number): Promise<Product> {
    const product: Product = await this.productsRepository.getProductById(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async thisProductExist(name: string): Promise<boolean> {
    if (await this.productsRepository.findByName(name))
      return Promise.resolve(true);
    return Promise.resolve(false);
  }

  async createProduct(product: ProductDto): Promise<Product> {
    if (await this.thisProductExist(product.name)) {
      throw new InternalServerErrorException('Producto ya existe');
    }

    return await this.productsRepository.createProduct(product);
  }

  async updateProduct(
    id: number,
    updateProduct: ProductDto,
  ): Promise<Product | undefined> {
    const product: Product = await this.productsRepository.getProductById(id);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return await this.productsRepository.updateProduct(product, updateProduct);
  }

  async updateProductImage(id: number, imageUrl: string): Promise<Product> {
    const product: Product = await this.productsRepository.getProductById(id);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return await this.productsRepository.updateProduct(product, {
      ...product,
    });
  }

  async deleteProduct(id: number): Promise<void> {
    if (!(await this.productsRepository.getProductById(id))) {
      throw new NotFoundException('Producto no encontrado');
    }

    return await this.productsRepository.deleteProduct(id);
  }
}
