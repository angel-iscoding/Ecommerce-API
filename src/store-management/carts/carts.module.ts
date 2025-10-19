import { Cart } from '@/database/entities/cart.entity';
import { CartItem } from '@/database/entities/cart-item.entity';
import { Product } from '@/database/entities/product.entity';
import { OrdersModule } from '@/store-management/orders/orders.module';
import { ProductsModule } from '@/store-management/products/products.module';
import { UsersModule } from '@/users-management/users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsRedisService } from './carts-redis.service';
import { CartsController } from './carts.controller';
import { CartsRepository } from './carts.repository';
import { CartsService } from './carts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product]),
    ProductsModule,
    forwardRef(() => OrdersModule),
    forwardRef(() => UsersModule),
  ],
  providers: [CartsService, CartsRepository, CartsRedisService],
  controllers: [CartsController],
  exports: [CartsService, CartsRepository],
})
export class CartsModule {}
