import { IsNotEmpty } from 'class-validator';

export class CreateCarDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    brand: string;

    @IsNotEmpty()
    color: string;

    @IsNotEmpty()
    price: string;
}
