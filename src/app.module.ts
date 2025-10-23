import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
// CloudModule removed
import typeOrmConfig from './config/typeorm';
// PaymentsModule removed
import { CartsModule } from './store-management/carts/carts.module';
import { CategoriesModule } from './store-management/categories/categories.module';
import { OrdersModule } from './store-management/orders/orders.module';
import { ProductsModule } from './store-management/products/products.module';
import { UsersModule } from './users-management/users/users.module';
import { RolesSeeder } from './users-management/roles/roles.seeder';
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
  // LoggerModule removed
    CartsModule,
    RolesModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    // CloudModule and PaymentsModule removed
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap {
  [x: string]: any;
  constructor(private readonly RolesSeeder: RolesSeeder) {}

  async onApplicationBootstrap() {
    try {
      await this.RolesSeeder.seed();
      /*  await this.categoriesService.preloadCategories(); */
    } catch (error) {

    }
  }
}
