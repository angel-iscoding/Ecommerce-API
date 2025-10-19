import { Cart } from '@/database/entities/cart.entity';
import { Product } from '@/database/entities/product.entity';
import { User } from '@/database/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async getAllCart(): Promise<Cart[]> {
    return await this.cartRepository.find({
      relations: ['cartItems', 'user'],
    });
  }

  async getCartById(id: number): Promise<Cart> {
    const cart: Cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartItems', 'cartItems.product', 'user'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product', 'user'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart for user ${userId} not found`);
    }

    return cart;
  }

  async save(cart: Cart): Promise<Cart> {
    return await this.cartRepository.save(cart);
  }

  async create(user: User): Promise<Cart> {
    const cart = this.cartRepository.create({ user });
    return await this.cartRepository.save(cart);
  }

  async removeProductFromCart(
    userId: string,
    productId: number,
  ): Promise<void> {
    const cart = await this.getCartByUserId(userId);

    // Remove cartItems referencing productId
    cart.cartItems = (cart.cartItems || []).filter(
      (ci) => ci.product.id !== productId,
    );

    await this.save(cart);
  }

  async clearCart(cart: Cart): Promise<void> {
    cart.cartItems = [];

    await this.save(cart);
  }

  async addProducts(cart: Cart, products: Product[]): Promise<Cart> {
    // create cartItems from products and append (set unit_price and quantity)
    const newItems = products.map(
      (p) => ({ product: p, unit_price: p.price, quantity: 1 }) as any,
    );
    cart.cartItems = [...(cart.cartItems || []), ...newItems];

    return await this.save(cart);
  }

  async updateCartPrice(cartId: number): Promise<number> {
    const cart = await this.getCartById(cartId);

    // calculate total from cartItems (unit_price * quantity)
    const total = (cart.cartItems || []).reduce(
      (sum, ci) =>
        sum + (ci.unit_price ?? ci.product?.price ?? 0) * (ci.quantity ?? 1),
      0,
    );

    // return computed total (don't assign to a non-existent column)
    return total;
  }
}
