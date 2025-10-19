import { AuthGuard } from '@/auth/auth.guard';
import { RequestWithUser } from '@/config/request-with-user.interface';
import { Roles } from '@/config/role.decorator';
import { RoleNames } from '@/config/role-names.enum';
import { idParamDto } from '@/database/idParamDto.dto';
import { Order } from '@/database/entities/order.entity';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(RoleNames.Admin)
  @ApiBearerAuth()
  async getAllOrders(): Promise<Order[]> {
    try {
      return await this.orderService.getAllOrders();
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener las ordenes: ' + error.message,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(RoleNames.Admin)
  @ApiBearerAuth()
  async getOrder(@Param() params: idParamDto): Promise<Order> {
    try {
      const order = await this.orderService.getById(params.id as any);
      if (!order) {
        throw new NotFoundException('Orden no encontrada');
      }
      return order;
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener la orden: ' + error.message,
      );
    }
  }

  @Get('orders')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getOrderOfUser(@Request() req: RequestWithUser): Promise<Order[]> {
    try {
      const orders = await this.orderService.getOrdersOfUser(req.user.id);
      return orders;
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener las ordenes del usuario: ' + error.message,
      );
    }
  }
}
