import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@/database/entities/role.entity';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { RolesSeeder } from './roles.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role])
  ],
  controllers: [],
  providers: [RolesService, RolesRepository, RolesSeeder],
  exports: [RolesService, RolesRepository, RolesSeeder]
})
export class RolesModule {}