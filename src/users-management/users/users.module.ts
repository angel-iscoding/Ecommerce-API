import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '@/database/entities/cart.entity';
import { Order } from '@/database/entities/order.entity';
import { User } from '@/database/entities/user.entity';
import { AuthGuard } from '@/auth/auth.guard';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { Role } from '@/database/entities/role.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Cart, Role]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => AuthModule),
    RolesModule,
  ],
  providers: [
    UsersService,
    UsersRepository,
    AuthGuard,
  ],
  controllers: [UsersController],
  exports: [
    UsersRepository,
    UsersService,
    JwtModule,
  ],
})
export class UsersModule {}
