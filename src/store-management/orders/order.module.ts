import { Order } from '@/database/entities/order.entity';
import { CartModule } from '@/store-management/cart/cart.module';
import { ProductsModule } from '@/store-management/products/product.module';
import { UsersModule } from '@/user-management/users/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => UsersModule),
    forwardRef(() => CartModule),
    ProductsModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
