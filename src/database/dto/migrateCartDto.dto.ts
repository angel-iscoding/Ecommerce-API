import { IsNotEmpty, IsUUID } from 'class-validator';

export class MigrateCartDto {
  @IsUUID()
  @IsNotEmpty()
  temporaryUserId: string;
}
