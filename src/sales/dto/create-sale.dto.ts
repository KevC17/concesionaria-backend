import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSaleDto {
    @IsNotEmpty()
    @IsUUID()
    car: string;

    @IsNotEmpty()
    @IsUUID()
    user: string;
}
