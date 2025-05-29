import { IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateCarDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  brand?: string;

  @IsOptional()
  color?: string;

  @IsOptional()
  price: string;

  @IsOptional()
  isActive?: boolean;
}
