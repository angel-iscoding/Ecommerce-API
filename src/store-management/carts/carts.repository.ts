import { Cart } from '@/database/entities/cart.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartsRepository {
  constructor(
    @InjectRepository(Cart)
    private CartsRepository: Repository<Cart>,
  ) {}

  async findAll(): Promise<Cart[]> {
    throw new BadRequestException("This method is not finished yet")
  }

  async findById(id: string): Promise<Cart> {
    throw new BadRequestException("This method is not finished yet")
  }

  async findByUserId(userId: string): Promise<Cart> {
    throw new BadRequestException("This method is not finished yet")
  }

  async create(): Promise<Cart> {
    throw new BadRequestException("This method is not finished yet")
  }

  async update(params) {
    return
  }

  async remove (params) {

  }
}
