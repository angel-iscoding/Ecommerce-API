import { Cart } from '@/database/entities/cart.entity';
import { Order } from '@/database/entities/order.entity';
import { Product } from '@/database/entities/product.entity';
import { User } from '@/database/entities/user.entity';
import { OrdersRepository } from '@/store-management/orders/orders.repository';
import { ProductsRepository } from '@/store-management/products/products.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '@/users-management/users/users.service';
import { CartsRedisService } from './carts-redis.service';
import { CartsRepository } from './carts.repository';
import { TemporaryCart } from './carts-redis.service';

@Injectable()
export class CartsService {
  constructor(
    private CartsRepository: CartsRepository,
    private usersService: UsersService,
    private productRepostory: ProductsRepository,
    private OrdersRepository: OrdersRepository,
    private CartsRedisService: CartsRedisService,
  ) {}

  async getAllCart(): Promise<Cart[]> {
    return await this.CartsRepository.getAllCart();
  }

  async thisUserExist(userId: string): Promise<boolean> {
    const user: Omit<User, 'password'> | undefined =
      await this.usersService.findById(userId);
    return !!user;
  }

  async getCart(cartId: string, isAuthenticated: boolean): Promise<Cart | any> {
    if (isAuthenticated)
      return await this.CartsRepository.getCartByUserId(cartId);

    const cartTemporaly = await this.CartsRedisService.getTemporaryCart(cartId);
    if (!cartTemporaly) throw new NotFoundException('Carrito no encontrado');
    return cartTemporaly;
  }

  async getCartByUser(id: string): Promise<Cart | undefined> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user.cart;
  }

  async addProductToCart(
    userId: string,
    productid: string[],
    isAuthenticated: boolean,
  ): Promise<Cart | TemporaryCart> {
    const products = await Promise.all(
      productid.map(async (id) => {
        const product = await this.productRepostory.getProductById(id);
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
    );
  }

  async addProductToUserCart(id: string, productid: string[]): Promise<Cart> {
    const cart = await this.CartsRepository.getCartByUserId(id);
    if (!cart) throw new NotFoundException('Error al encontrar el usuario');

    const validProducts: Product[] = [];
    for (const currentProductId of productid) {
      const product =
        await this.productRepostory.getProductById(currentProductId);
      if (product) validProducts.push(product);
    }

    const updated = await this.CartsRepository.addProducts(cart, validProducts);
    return updated;
  }

  async buyCart(userId: string): Promise<Order> {
    const user: User = await this.usersService.findCompleteById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const cart: Cart = await this.CartsRepository.getCartByUserId(user.id);
    if (!cart) throw new NotFoundException('Carrito no encontrado');

    const total = (cart.cartItems || []).reduce(
      (sum, ci) =>
        sum + (ci.unit_price ?? ci.product?.price ?? 0) * (ci.quantity ?? 1),
      0,
    );

    for (const ci of cart.cartItems || []) {
      if (ci.product && ci.product.stock && ci.product.stock > 0) {
        await this.productRepostory.downStock(ci.product);
      }
    }

    const order: Order = await this.OrdersRepository.create(user);
    order.order_number = `ORD-${Date.now()}`;
    order.order_date = new Date();
    order.total_amount = total;
    order.shipping_address = user.address;

    await this.OrdersRepository.save(order);
    await this.CartsRepository.clearCart(cart);
    return order;
  }

  async deleteProduct(id: string, productid: string[]): Promise<Cart> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('Error al encontrar el usuario');

    const cart = await this.CartsRepository.getCartByUserId(user.id);
    if (!cart) throw new NotFoundException('Carrito no encontrado');

    cart.cartItems = (cart.cartItems || []).filter(
      (ci) => !productid.includes(ci.product.id),
    );

    return await this.CartsRepository.save(cart);
  }

  async getAllProductsOfUserCart(userId: string): Promise<string[]> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const cart = await this.CartsRepository.getCartByUserId(user.id);
    const products = (cart.cartItems || []).map((ci) => ci.product.id);
    return products;
  }

  async migrateCartToUser(
    temporaryUserId: string,
    authenticatedUserId: string,
  ): Promise<void> {
    const temporaryCart =
      await this.CartsRedisService.getTemporaryCart(temporaryUserId);
    if ((temporaryCart.products || []).length > 0) {
      const productIds = temporaryCart.products.map((p) => p.id as string);
      await this.addProductToUserCart(authenticatedUserId, productIds);
      await this.CartsRedisService.removeTemporaryCart(temporaryUserId);
    }
  }

  async removeFromCart(
    userId: string,
    productid: string,
    isAuthenticated: boolean,
  ): Promise<void> {
    if (isAuthenticated) {
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
    );
  }

  async clearCart(userId: string, isAuthenticated: boolean): Promise<void> {
    if (isAuthenticated) {
      await this.CartsRepository.clearCart(
        await this.CartsRepository.getCartByUserId(userId),
      );
      return;
    }

    await this.CartsRedisService.removeTemporaryCart(userId);
  }
}
