import { JwtStrategy } from '@/config/jwtStrategy';
import { UsersModule } from '@/user-management/users/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleModule } from '@/user-management/roles/role.module';
import { RoleService } from '@/user-management/roles/role.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    RoleModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtService, JwtStrategy, RoleService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
