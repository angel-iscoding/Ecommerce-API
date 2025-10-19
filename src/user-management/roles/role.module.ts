import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@/database/entities/role.entity';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { RoleController } from './role.controller';
import { RoleSeeder } from './role.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, RoleSeeder],
  exports: [RoleService, RoleRepository]
})
export class RoleModule {}