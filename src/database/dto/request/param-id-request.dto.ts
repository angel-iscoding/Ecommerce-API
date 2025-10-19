import { IsUUID } from 'class-validator';

export class ParamIdRequestDto {
  @IsUUID()
  id: string;
}
