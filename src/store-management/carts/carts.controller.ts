import { AuthGuard } from '@/auth/auth.guard';
import { IUserPayloadRequest } from '@/database/dto/request/user-payload-request.interface';
import { Cart } from '@/database/entities/cart.entity';
import { MigrateCartDto } from '@/database/dto/migrateCartDto.dto';
import { ParamIdRequestDto } from '@/database/dto/request/param-id-request.dto';
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
import { CartsService } from './carts.service';
import { TemporaryCart } from './carts-redis.service';

@ApiTags('Cart')
@Controller('cart')
export class CartsController {
  constructor(private readonly CartsService: CartsService) {}

  @Post('add')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async add(
    @Body() data: string[],
    @Request() req: IUserPayloadRequest,
  ): Promise<{data: IUserPayloadRequest} /* { message: string; id: string } */> {
    try {

      if (req.user) {
        
      }

      const isAuthenticated: boolean = req.user ? true : false;




      return;
      

     /*  const isAuthenticated: boolean = req.user ? true : false;
      const userId: string = isAuthenticated ? req.user.id : uuidv4();

      const cart: Cart | TemporaryCart =
        await this.CartsService.addProductToCart(userId, data, isAuthenticated);

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
      } */
    } catch (error) {
      throw new BadRequestException(
        'No se pudo agregar el producto al carrito: ' + error.message,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async findById(
    @Param() params: ParamIdRequestDto,
    @Request() req: IUserPayloadRequest,
  ): Promise<any/* { message: string; id: string; cart: Cart } */> {
    try {
      /* const isAuthenticated: boolean = req.user ? true : false;
      const idUser: string = isAuthenticated ? req.user.id : params.id;

      const cart: Cart = await this.CartsService.getCart(
        idUser,
        isAuthenticated,
      );

      return {
        message: `Carrito ${isAuthenticated ? '' : 'de usuario no autentificado '}obtenido con exito`,
        id: idUser,
        cart: cart,
      }; */
    } catch (error) {
      throw new BadRequestException(
        'No se pudo obtener el carrito: ' + error.message,
      );
    }
  }

  @Post('purchase')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async buy(
    @Request() req: IUserPayloadRequest,
  ): Promise<any/* { message: string; id: string } */> {
    try {
      /* const isAuthenticated: boolean = req.user ? true : false;

      if (!isAuthenticated)
        throw new BadRequestException('No se puede comprar sin iniciar sesión');

      const userId: string = req.user.id;

      const response = await this.CartsService.buyCart(userId);
      if (response) {
        return {
          message: 'Compra realizada con exito',
          id: userId,
        };
      } else {
        throw new BadRequestException('No se pudo realizar la compra');
      } */
    } catch (error) {
      throw new BadRequestException(
        'No se pudo realizar la compra: ' + error.message,
      );
    }
  }

  @Post('migrate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async migrate(
    @Body() data: MigrateCartDto,
    @Request() req: IUserPayloadRequest,
  ): Promise<any/* { message: string } */> {
    try {
      /* const isAuthenticated: boolean = req.user ? true : false;

      if (!isAuthenticated)
        throw new BadRequestException(
          'El usuario debe estar logeado para hacer esta peticion.',
        );

      const userId: string = req.user.id;

      await this.CartsService.migrateCartToUser(data.temporaryUserId, userId);
      return { message: 'Carrito migrado exitosamente' }; */
    } catch (error) {
      throw new BadRequestException(
        'No se pudo migrar el carrito: ' + error.message,
      );
    }
  }

  @Delete('remove')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async remove(
    @Body() data: string,
    @Request() req: IUserPayloadRequest,
  ): Promise<any/* { message: string } */> {
    try {
      /* const isAuthenticated: boolean = req.user ? true : false;

      if (!isAuthenticated)
        throw new BadRequestException(
          'El usuario debe estar logeado para hacer esta peticion.',
        );

      const userId: string = req.user.id;

      await this.CartsService.removeFromCart(userId, data, isAuthenticated);
      return { message: 'Producto removido del carrito' }; */
    } catch (error) {
      throw new BadRequestException(
        'No se pudo remover el producto del carrito: ' + error.message,
      );
    }
  }

  @Delete('clear')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async clear(
    @Request() req: IUserPayloadRequest,
  ): Promise<any/* { message: string } */> {
    try {
      /* const isAuthenticated: boolean = req.user ? true : false;

      if (!isAuthenticated)
        throw new BadRequestException(
          'El usuario debe estar logeado para hacer esta peticion.',
        );

      const userId: string = req.user.id;

      await this.CartsService.clearCart(userId, isAuthenticated);
      return { message: 'Carrito limpiado' }; */
    } catch (error) {
      throw new BadRequestException(
        'No se pudo limpiar el carrito: ' + error.message,
      );
    }
  }
}
