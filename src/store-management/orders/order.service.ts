import { OrderDto } from '@/database/dto/order.dto';
import { Order } from '@/database/entities/order.entity';
import { User } from '@/database/entities/user.entity';
import { UsersRepository } from '@/user-management/users/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createOrder(order: OrderDto): Promise<Order> {
    const user = await this.usersRepository.searchCompleteUserById(order.user_id);

    if (!user) throw new NotFoundException('No existe el usuario');

    const newOrder: Order = await this.ordersRepository.create(user);

    // Use cart service to compute total and get product ids
    // For now set order_number and total amount
    newOrder.order_number = `ORD-${Date.now()}`;
    newOrder.order_date = new Date();
    newOrder.total_amount = 0;

    // Save and return (detailed order items management can be added later)
    return await this.ordersRepository.save(newOrder);
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.ordersRepository.getAllOrders();
  }

  async getById(id: number): Promise<Order | null> {
    return await this.ordersRepository.getById(id);
  }

  async getOrdersOfUser(id: string): Promise<Order[]> {
    const user: Omit<User, 'password'> =
      await this.usersRepository.getUserById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return await this.ordersRepository.getAllOrders();
  }
}
