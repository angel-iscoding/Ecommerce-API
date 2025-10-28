import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '@/database/entities/cart.entity';
import { Order } from '@/database/entities/order.entity';
import { User } from '@/database/entities/user.entity';
import { AuthGuard } from '@/auth/auth.guard';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersSeeder } from './users.seeder';
import { Role } from '@/database/entities/role.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Cart, Role]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    RolesModule,
  ],
  providers: [
    UsersService,
    UsersRepository,
    AuthGuard,
    UsersSeeder,
  ],
  controllers: [UsersController],
  exports: [
    UsersRepository,
    UsersService,
    UsersSeeder,
    JwtModule,
  ],
})
export class UsersModule {}
