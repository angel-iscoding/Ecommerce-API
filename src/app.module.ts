import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CloudModule } from './cloud/cloud.module';
import typeOrmConfig from './config/typeorm';
import { PaymentsModule } from './payments/payments.module';
import { CartModule } from './store-management/cart/cart.module';
import { CategoriesModule } from './store-management/categories/category.module';
import { OrderModule } from './store-management/orders/order.module';
import { ProductsModule } from './store-management/products/product.module';
import { UsersModule } from './user-management/users/user.module';
import { LoggerModule } from './utils/logger/logger.module';
import { RoleSeeder } from './user-management/roles/role.seeder';
import { CustomLogger } from './utils/logger/custom-logger.module';
import { RoleService } from './user-management/roles/role.service';
import { RoleModule } from './user-management/roles/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Cambialo dependiendo del archivo .env que tengas
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) =>
        ConfigService.get('typeorm'),
    }),
    LoggerModule,
    CartModule,
    RoleModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrderModule,
    CloudModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [RoleSeeder, RoleService, CustomLogger],
})
export class AppModule implements OnApplicationBootstrap {
  [x: string]: any;
  constructor(
    private readonly roleSeeder: RoleSeeder,
    private readonly logger: CustomLogger,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.roleSeeder.seed();
      /*  await this.categoriesService.preloadCategories(); */
      this.logger.log('Precarga de datos completada');
    } catch (error) {
      this.logger.error('Error durante precarga de datos', error);
    }
  }
}
