import { Controller } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly rolesService: RolesService) {}
}
