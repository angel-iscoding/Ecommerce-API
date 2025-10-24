import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import typeOrmConfig from './config/typeorm';
import { UsersModule } from './users-management/users/users.module';
import { RolesSeeder } from './users-management/roles/roles.seeder';
import { RolesModule } from './users-management/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Change it depending of the .env file
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) =>
        ConfigService.get('typeorm'),
    }),
    RolesModule,
    UsersModule,
    AuthModule,
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
    } catch (error) {

    }
  }
}
