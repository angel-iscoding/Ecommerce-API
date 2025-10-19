import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { CartsModule } from '@/store-management/carts/carts.module';
import { OrdersModule } from '@/store-management/orders/orders.module';
import { ProductsModule } from '@/store-management/products/products.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsRepository } from '@/store-management/carts/carts.repository';
import { OrdersRepository } from '@/store-management/orders/orders.repository';
import { Cart } from '@/database/entities/cart.entity';
import { Order } from '@/database/entities/order.entity';
import { User } from '@/database/entities/user.entity';
import { AuthGuard } from '@/auth/auth.guard';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { Role } from '@/database/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Cart, Role]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => CartsModule),
    forwardRef(() => RolesModule),
  ],
  providers: [
    RolesService,
    UsersService,
    UsersRepository,
    OrdersRepository,
    CartsRepository,
    AuthGuard,
  ],
  controllers: [UsersController],
  exports: [
    UsersRepository,
    UsersService,
    JwtModule,
    OrdersRepository,
    CartsRepository,
  ],
})
export class UsersModule {}
