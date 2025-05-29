import { IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateSaleDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  brand?: string;
}
