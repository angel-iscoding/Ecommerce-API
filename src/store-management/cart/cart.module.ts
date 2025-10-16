import { Cart } from '@/database/cart/cart.entity';
import { OrderModule } from '@/store-management/orders/order.module';
import { ProductsModule } from '@/store-management/products/product.module';
import { UsersModule } from '@/user-management/users/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartRedisService } from './cart-redis.service';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    ProductsModule,
    forwardRef(() => OrderModule),
    forwardRef(() => UsersModule),
  ],
  providers: [CartService, CartRepository, CartRedisService],
  controllers: [CartController],
  exports: [CartService, CartRepository],
})
export class CartModule {}
