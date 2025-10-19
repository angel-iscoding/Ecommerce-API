import { ProductDto } from '@/database/dto/product.dto';
import { Product } from '@/database/entities/product.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return await this.productsRepository.findOne({ where: { id: id } });
  }

  async findByName(name: string): Promise<Product | undefined> {
    return await this.productsRepository.findOne({ where: { name: name } });
  }

  async createProduct(product: ProductDto): Promise<Product> {
    const thisProductExist = await this.findByName(product.name);

    if (thisProductExist)
      throw new InternalServerErrorException('El producto ya fue creado');

    const newProduct = this.productsRepository.create({
      ...product,
      id: product.id,
    });

    return await this.productsRepository.save(newProduct);
  }

  async updateProduct(
    product: Product,
    updateProduct: ProductDto,
  ): Promise<Product> {
    await this.productsRepository.update(product.id, updateProduct);
    return await this.productsRepository.findOne({ where: { id: product.id } });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productsRepository.delete({ id: id });
  }

  async downStock(product: Product): Promise<Product> {
    await this.productsRepository.update(product.id, {
      ...product,
      stock: product.stock - 1,
    });
    return await this.productsRepository.findOne({ where: { id: product.id } });
  }
}
