import { IUserPayloadRequest } from '@/database/dto/request/user-payload-request.interface';
import { CartsRedisService } from './carts-redis.service';
import { CartsService } from './carts.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class CartOrchestrationService {
    constructor(
        private CartsService: CartsService,
        private CartsRedisService: CartsRedisService,
    ) {}

    async addToCart(
    userPayload: IUserPayloadRequest | null,
    productData: string[],
    clientCartId?: string, // Always come from the client
  ): Promise<CartOperationResult> {
    
    // Generar o usar ID existente
    const cartId = clientCartId || uuidv4();
    
    if (userPayload) {
      // Usuario autenticado - buscar o crear carrito con este ID
      return await this.handleAuthenticatedUser(userPayload.id, cartId, productData);
    } else {
      // Usuario no autenticado - carrito temporal
      return await this.CartsRedisService.addProductToCart(cartId, productData);
    }
  }

  private async handleAuthenticatedUser(
    userId: string, 
    cartId: string, 
    productData: string[]
  ): Promise<CartOperationResult> {
    // 1. Buscar carrito permanente del usuario
    let userCart = await this.CartsService.findByUserId(userId);
    
    // 2. Si existe carrito temporal, migrar items
    const temporaryCart = await this.CartsRedisService.getCart(cartId);
    if (temporaryCart) {
      userCart = await this.migrateTemporaryToPermanent(userId, temporaryCart);
      await this.CartsRedisService.deleteCart(cartId);
    }
    
    // 3. Agregar nuevos productos
    return await this.CartsService.addProductToCart(userId, productData);
  }
}
