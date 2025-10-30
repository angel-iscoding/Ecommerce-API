import { Cart } from '@/database/entities/cart.entity';
import { CartItem } from '@/database/entities/cart-item.entity';
import { Product } from '@/database/entities/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsRedisService } from './carts-redis.service';
import { CartsController } from './carts.controller';
import { CartsRepository } from './carts.repository';
import { CartsService } from './carts.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersModule } from '@/users-management/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product]),
    UsersModule
  ],
  providers: [CartsService, CartsRepository, CartsRedisService],
  controllers: [CartsController],
  exports: [CartsService, CartsRepository],
})
export class CartsModule {}
