import { AuthGuard } from '@/auth/auth.guard';
import { Category } from '@/database/entities/category.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './category.controller';
import { CategoriesRepository } from './category.repository';
import { CategoriesService } from './category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    JwtModule.register({
      secret: process.env.JTW_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [CategoriesService, CategoriesRepository, AuthGuard],
  controllers: [CategoriesController],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
