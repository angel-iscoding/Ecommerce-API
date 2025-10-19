import { AuthGuard } from '@/auth/auth.guard';
import { RequestWithUser } from '@/config/request-with-user.interface';
import { Cart } from '@/database/entities/cart.entity';
import { MigrateCartDto } from '@/database/dto/migrateCartDto.dto';
import { idParamDto } from '@/database/idParamDto.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { CartService } from './cart.service';
import { TemporaryCart } from './cart-redis.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async addToCart(
    @Body() data: number[],
    @Request() req: RequestWithUser,
  ): Promise<{ message: string; id: string }> {
    try {
      const isAuthenticated: boolean = req.user ? true : false;
      const userId: string = isAuthenticated ? req.user.id : uuidv4();

      const cart: Cart | TemporaryCart =
        await this.cartService.addProductToCart(userId, data, isAuthenticated);

      if (cart instanceof Cart) {
        return {
          message: `Productos: ${cart.cartItems.map((p) => p.product.id).join(', ')}. Agregados al carrito del usuario.`,
          id: userId,
        };
      } else {
        return {
          message: `Productos: ${cart.products.map((p) => p.id).join(', ')}. Agregados al carrito del usuario.`,
          id: userId,
        };
      }
    } catch (error) {
      throw new BadRequestException(
        'No se pudo agregar el producto al carrito: ' + error.message,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getCart(
    @Param() params: idParamDto,
    @Request() req: RequestWithUser,
  ): Promise<{ message: string; id: string; cart: Cart }> {
    try {
      const isAuthenticated: boolean = req.user ? true : false;
      const idUser: string = isAuthenticated ? req.user.id : params.id;

      const cart: Cart = await this.cartService.getCart(
        idUser,
        isAuthenticated,
      );

      return {
        message: `Carrito ${isAuthenticated ? '' : 'de usuario no autentificado '}obtenido con exito`,
        id: idUser,
        cart: cart,
      };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener el carrito: ' + error.message,
      );
    }
  }

  @Post('purchase')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async buyCart(
    @Request() req: RequestWithUser,
  ): Promise<{ message: string; id: string }> {
    try {
      const isAuthenticated: boolean = req.user ? true : false;

      if (!isAuthenticated)
        throw new BadRequestException('No se puede comprar sin iniciar sesión');

      const userId: string = req.user.id;

      const response = await this.cartService.buyCart(userId);
      if (response) {
        return {
          message: 'Compra realizada con exito',
          id: userId,
        };
      } else {
        throw new BadRequestException('No se pudo realizar la compra');
      }
    } catch (error) {
      throw new BadRequestException(
        'No se pudo realizar la compra: ' + error.message,
      );
    }
  }

  @Post('migrate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async migrateCart(
    @Body() data: MigrateCartDto,
    @Request() req: RequestWithUser,
  ): Promise<{ message: string }> {
    try {
      const isAuthenticated: boolean = req.user ? true : false;

      if (!isAuthenticated)
        throw new BadRequestException(
          'El usuario debe estar logeado para hacer esta peticion.',
        );

      const userId: string = req.user.id;

      await this.cartService.migrateCartToUser(data.temporaryUserId, userId);
      return { message: 'Carrito migrado exitosamente' };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo migrar el carrito: ' + error.message,
      );
    }
  }

  @Delete('remove')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async removeFromCart(
    @Body() data: number,
    @Request() req: RequestWithUser,
  ): Promise<{ message: string }> {
    try {
      const isAuthenticated: boolean = req.user ? true : false;

      if (!isAuthenticated)
        throw new BadRequestException(
          'El usuario debe estar logeado para hacer esta peticion.',
        );

      const userId: string = req.user.id;

      await this.cartService.removeFromCart(userId, data, isAuthenticated);
      return { message: 'Producto removido del carrito' };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo remover el producto del carrito: ' + error.message,
      );
    }
  }

  @Delete('clear')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async clearCart(
    @Request() req: RequestWithUser,
  ): Promise<{ message: string }> {
    try {
      const isAuthenticated: boolean = req.user ? true : false;

      if (!isAuthenticated)
        throw new BadRequestException(
          'El usuario debe estar logeado para hacer esta peticion.',
        );

      const userId: string = req.user.id;

      await this.cartService.clearCart(userId, isAuthenticated);
      return { message: 'Carrito limpiado' };
    } catch (error) {
      throw new BadRequestException(
        'No se pudo limpiar el carrito: ' + error.message,
      );
    }
  }
}
