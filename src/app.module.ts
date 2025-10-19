import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CloudModule } from './cloud/cloud.module';
import typeOrmConfig from './config/typeorm';
import { PaymentsModule } from './payments/payments.module';
import { CartsModule } from './store-management/carts/carts.module';
import { CategoriesModule } from './store-management/categories/categories.module';
import { OrdersModule } from './store-management/orders/orders.module';
import { ProductsModule } from './store-management/products/products.module';
import { UsersModule } from './users-management/users/users.module';
import { LoggerModule } from './utils/logger/logger.module';
import { RolesSeeder } from './users-management/roles/roles.seeder';
import { CustomLogger } from './utils/logger/custom-logger.module';
import { RolesService } from './users-management/roles/roles.service';
import { RolesModule } from './users-management/roles/roles.module';

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
    CartsModule,
    RolesModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CloudModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [RolesSeeder, RolesService, CustomLogger],
})
export class AppModule implements OnApplicationBootstrap {
  [x: string]: any;
  constructor(
    private readonly RolesSeeder: RolesSeeder,
    private readonly logger: CustomLogger,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.RolesSeeder.seed();
      /*  await this.categoriesService.preloadCategories(); */
      this.logger.log('Precarga de datos completada');
    } catch (error) {
      this.logger.error('Error durante precarga de datos', error);
    }
  }
}
