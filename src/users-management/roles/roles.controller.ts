import { BadRequestException, Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleNames } from '@/config/role-names.enum';
import { Roles } from '@/config/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ParamIdRequestDto } from '@/database/dto/request/param-id-request.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('role-assignment/:userId')
  @UseGuards(AuthGuard)
  @Roles(RoleNames.Admin)
  async assignRole(
    @Param('userId') userId: string,
    @Body() body: ParamIdRequestDto
  ) {
    try {
      const assignedRole = this.rolesService.assignRole(userId, body.id);

      return {
        status: 'success',
        message: 'Role assigned successfully',
        data: assignedRole
      };
    } catch (error) {
      throw new BadRequestException(
        'Warning: ' + error.message
      );
    }
  }
}
