import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: 'Product name is required' })
    @IsString({ message: 'Product name must be a string' })
    name!: string;

    @IsNotEmpty({ message: 'Product price is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Product price must be a number' })
    price!: number;

    @IsNotEmpty({ message: 'Image mandatory' })
    image!: string;

    @IsNotEmpty({ message: 'Product inventory is required' })
    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Product inventory must be a number' })
    inventory!: number;

    @IsNotEmpty({ message: 'Category ID is required' })
    @IsInt({ message: 'Category ID must be an integer' })
    categoryId!: number;
}
