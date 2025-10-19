import { Cart } from '@/database/entities/cart.entity';
import { Order } from '@/database/entities/order.entity';
import { Product } from '@/database/entities/product.entity';
import { User } from '@/database/entities/user.entity';
import { OrderRepository } from '@/store-management/orders/order.repository';
import { ProductsRepository } from '@/store-management/products/product.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/user-management/users/user.repository';
import { CartRedisService } from './cart-redis.service';
import { CartRepository } from './cart.repository';
import { TemporaryCart } from './cart-redis.service';

@Injectable()
export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private userRepository: UsersRepository,
    private productRepostory: ProductsRepository,
    private orderRepository: OrderRepository,
    private cartRedisService: CartRedisService,
  ) {}

  async getAllCart(): Promise<Cart[]> {
    return await this.cartRepository.getAllCart();
  }

  async thisUserExist(userId: string): Promise<boolean> {
    const user: Omit<User, 'password'> | undefined =
      await this.userRepository.getUserById(userId);
    return !!user;
  }

  async getCart(cartId: string, isAuthenticated: boolean): Promise<Cart | any> {
    if (isAuthenticated)
      return await this.cartRepository.getCartByUserId(cartId);

    const cartTemporaly = await this.cartRedisService.getTemporaryCart(cartId);
    if (!cartTemporaly) throw new NotFoundException('Carrito no encontrado');
    return cartTemporaly;
  }

  async getCartByUser(id: string): Promise<Cart | undefined> {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user.cart;
  }

  async addProductToCart(
    userId: string,
    productId: number[],
    isAuthenticated: boolean,
  ): Promise<Cart | TemporaryCart> {
    const products = await Promise.all(
      productId.map(async (id) => {
        const product = await this.productRepostory.getProductById(id);
        if (!product)
          throw new NotFoundException(`Producto ${id} no encontrado`);
        return product;
      }),
    );

    if (isAuthenticated) {
      await this.addProductToUserCart(userId, productId);
      return;
    }

    const temporaryCart: TemporaryCart =
      await this.cartRedisService.getTemporaryCart(userId);
    const updatedProducts = [...temporaryCart.products, ...products];

    return await this.cartRedisService.updateTemporaryCart(
      userId,
      updatedProducts as any,
    );
  }

  async addProductToUserCart(id: string, productId: number[]): Promise<Cart> {
    const cart = await this.cartRepository.getCartByUserId(id);
    if (!cart) throw new NotFoundException('Error al encontrar el usuario');

    const validProducts: Product[] = [];
    for (const currentProductId of productId) {
      const product =
        await this.productRepostory.getProductById(currentProductId);
      if (product) validProducts.push(product);
    }

    const updated = await this.cartRepository.addProducts(cart, validProducts);
    return updated;
  }

  async buyCart(userId: string): Promise<Order> {
    const user: User = await this.userRepository.searchCompleteUserById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const cart: Cart = await this.cartRepository.getCartByUserId(user.id);
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

    const order: Order = await this.orderRepository.create(user);
    order.order_number = `ORD-${Date.now()}`;
    order.order_date = new Date();
    order.total_amount = total;
    order.shipping_address = user.address;

    await this.orderRepository.save(order);
    await this.cartRepository.clearCart(cart);
    return order;
  }

  async deleteProduct(id: string, productId: number[]): Promise<Cart> {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException('Error al encontrar el usuario');

    const cart = await this.cartRepository.getCartByUserId(user.id);
    if (!cart) throw new NotFoundException('Carrito no encontrado');

    cart.cartItems = (cart.cartItems || []).filter(
      (ci) => !productId.includes(ci.product.id),
    );

    return await this.cartRepository.save(cart);
  }

  async getAllProductsOfUserCart(userId: string): Promise<number[]> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const cart = await this.cartRepository.getCartByUserId(user.id);
    const products = (cart.cartItems || []).map((ci) => ci.product.id);
    return products;
  }

  async migrateCartToUser(
    temporaryUserId: string,
    authenticatedUserId: string,
  ): Promise<void> {
    const temporaryCart =
      await this.cartRedisService.getTemporaryCart(temporaryUserId);
    if ((temporaryCart.products || []).length > 0) {
      const productIds = temporaryCart.products.map((p) => p.id as number);
      await this.addProductToUserCart(authenticatedUserId, productIds);
      await this.cartRedisService.removeTemporaryCart(temporaryUserId);
    }
  }

  async removeFromCart(
    userId: string,
    productId: number,
    isAuthenticated: boolean,
  ): Promise<void> {
    if (isAuthenticated) {
      await this.cartRepository.removeProductFromCart(userId, productId);
      return;
    }

    const temporaryCart = await this.cartRedisService.getTemporaryCart(userId);
    const updatedProducts = (temporaryCart.products || []).filter(
      (product) => product.id !== productId,
    );
    await this.cartRedisService.updateTemporaryCart(
      userId,
      updatedProducts as any,
    );
  }

  async clearCart(userId: string, isAuthenticated: boolean): Promise<void> {
    if (isAuthenticated) {
      await this.cartRepository.clearCart(
        await this.cartRepository.getCartByUserId(userId),
      );
      return;
    }

    await this.cartRedisService.removeTemporaryCart(userId);
  }
}
