import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { CartModule } from '@/store-management/cart/cart.module';
import { OrderModule } from '@/store-management/orders/order.module';
import { ProductsModule } from '@/store-management/products/product.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartRepository } from '@/store-management/cart/cart.repository';
import { OrderRepository } from '@/store-management/orders/order.repository';
import { Cart } from '@/database/cart/cart.entity';
import { Order } from '@/database/orders/order.entity';
import { User } from '@/database/users/user.entity';
import { AuthGuard } from '@/auth/auth.guard';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { UsersRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Cart]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => OrderModule),
    forwardRef(() => CartModule),
  ],
  providers: [
    UsersService,
    UsersRepository,
    OrderRepository,
    CartRepository,
    AuthGuard,
  ],
  controllers: [UsersController],
  exports: [
    UsersRepository,
    UsersService,
    JwtModule,
    OrderRepository,
    CartRepository,
  ],
})
export class UsersModule {}
