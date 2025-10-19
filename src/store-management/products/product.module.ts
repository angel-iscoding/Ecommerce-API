import { AuthGuard } from '@/auth/auth.guard';
import { Product } from '@/database/entities/product.entity';
import { Category } from '@/database/entities/category.entity';
import { CartItem } from '@/database/entities/cart-item.entity';
import { CategoriesModule } from '@/store-management/categories/category.module';
import { UsersModule } from '@/user-management/users/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './product.controller';
import { ProductsRepository } from './product.repository';
import { ProductsService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, CartItem]),
    CategoriesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [ProductsService, ProductsRepository, AuthGuard],
  controllers: [ProductsController],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
