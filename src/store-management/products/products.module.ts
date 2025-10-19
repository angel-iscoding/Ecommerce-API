import { AuthGuard } from '@/auth/auth.guard';
import { Product } from '@/database/entities/product.entity';
import { Category } from '@/database/entities/category.entity';
import { CartItem } from '@/database/entities/cart-item.entity';
import { CategoriesModule } from '@/store-management/categories/categories.module';
import { UsersModule } from '@/users-management/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

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
