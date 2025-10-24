import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesService } from '@/users-management/roles/roles.service';
import { RoleNames } from '@/config/role-names.enum';
import usersData from '@/utils/scripts/users.data';

@Injectable()
export class UsersSeeder {
  private readonly logger = new Logger(UsersSeeder.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async seed(): Promise<void> {
    for (const u of usersData) {
      const exists = await this.usersService.thisUserExist(u.email);
      if (exists) {
        this.logger.log(`User ${u.email} already exists, skipping`);
        continue;
      }

      // Create user (will be created with default role)
      const created = await this.usersService.create(u as any);
      this.logger.log(`Created user ${created.email}`);

      // Ensure user has admin role
      const adminRole = await this.rolesService.findByName(RoleNames.Admin);
      if (adminRole) {
        await this.usersService.assignRole((created as any).id, adminRole.id);
        this.logger.log(`Assigned admin role to ${created.email}`);
      }
    }
  }
}