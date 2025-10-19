import { Order } from '@/database/entities/order.entity';
import { User } from '@/database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return await this.ordersRepository.find({ relations: ['user'] });
  }

  async getById(id: string): Promise<Order | null> {
    return await this.ordersRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async create(user: User): Promise<Order> {
    const order = this.ordersRepository.create({ user } as Partial<Order>);
    return await this.ordersRepository.save(order);
  }

  async save(order: Order): Promise<Order> {
    return await this.ordersRepository.save(order);
  }
}
