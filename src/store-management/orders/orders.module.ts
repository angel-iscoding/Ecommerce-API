import { Order } from '@/database/entities/order.entity';
import { CartsModule } from '@/store-management/carts/carts.module';
import { ProductsModule } from '@/store-management/products/products.module';
import { UsersModule } from '@/users-management/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => UsersModule),
    forwardRef(() => CartsModule),
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
