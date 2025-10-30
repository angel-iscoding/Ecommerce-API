import { Cart } from '@/database/entities/cart.entity';
import { Product } from '@/database/entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CartsRedisService } from './carts-redis.service';
import { CartsRepository } from './carts.repository';
import { TemporaryCart } from './carts-redis.service';

@Injectable()
export class CartsService {
  constructor(
    private CartsRepository: CartsRepository,
    private CartsRedisService: CartsRedisService,
  ) {}

  async findAll(): Promise<Cart[]> {
    return await this.CartsRepository.findAll();
  }

  async findById(cartId: string, isAuthenticated: boolean): Promise<Cart | any> {
    if (isAuthenticated)
      return await this.CartsRepository.findByUserId(cartId);

    const cartTemporaly = await this.CartsRedisService.getTemporaryCart(cartId);
    if (!cartTemporaly) throw new NotFoundException('Carrito no encontrado');
    return cartTemporaly;
  }

  async findByUser(id: string): Promise<any/* Cart | undefined */> {
    // Retorna estructura buscada por findOne  
  }

  async addProducts(
    userId: string,
    productid: string[],
    isAuthenticated: boolean,
  ): Promise<any/* Cart | TemporaryCart */> {
    /* const products = await Promise.all(
      productid.map(async (id) => {
        //Retorna producto
        if (!product)
          throw new NotFoundException(`Producto ${id} no encontrado`);
        return product;
      }),
    );

    if (isAuthenticated) {
      await this.addProductToUserCart(userId, productid);
      return;
    }

    const temporaryCart: TemporaryCart =
      await this.CartsRedisService.getTemporaryCart(userId);
    const updatedProducts = [...temporaryCart.products, ...products];

    return await this.CartsRedisService.updateTemporaryCart(
      userId,
      updatedProducts as any,
    ); */
  }

  async addProductToUserCart(id: string, productid: string[]): Promise<any/* Cart */> {
    /* const cart = await this.CartsRepository.getCartByUserId(id);
    if (!cart) throw new NotFoundException('Error al encontrar el usuario');

    const validProducts: Product[] = [];
    for (const currentProductId of productid) {
      const product =
        await this.productRepostory.getProductById(currentProductId);
      if (product) validProducts.push(product);
    }

    const updated = await this.CartsRepository.addProducts(cart, validProducts);
    return updated; */
  }

  //Debería ser logica de usuario
  async migrateCartToUser(
    temporaryUserId: string,
    authenticatedUserId: string,
  ): Promise<void> {
    /* const temporaryCart =
      await this.CartsRedisService.getTemporaryCart(temporaryUserId);
    if ((temporaryCart.products || []).length > 0) {
      const productIds = temporaryCart.products.map((p) => p.id as string);
      await this.addProductToUserCart(authenticatedUserId, productIds);
      await this.CartsRedisService.removeTemporaryCart(temporaryUserId);
    } */
  }

  async removeFromCart(
    userId: string,
    productid: string,
    isAuthenticated: boolean,
  ): Promise<void> {
   /*  if (isAuthenticated) {
      await this.CartsRepository.removeProductFromCart(userId, productid);
      return;
    }

    const temporaryCart = await this.CartsRedisService.getTemporaryCart(userId);
    const updatedProducts = (temporaryCart.products || []).filter(
      (product) => product.id !== productid,
    );
    await this.CartsRedisService.updateTemporaryCart(
      userId,
      updatedProducts as any,
    ); */
  }

  async clearCart(userId: string, isAuthenticated: boolean): Promise<void> {
    /* if (isAuthenticated) {
      await this.CartsRepository.clearCart(
        await this.CartsRepository.getCartByUserId(userId),
      );
      return;
    }

    await this.CartsRedisService.removeTemporaryCart(userId); */
  }
}
