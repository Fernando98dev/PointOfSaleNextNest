import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class CreateCouponDto {

    @IsNotEmpty({ message: 'Name of the coupon is mandatory' })
    name!: string;

    @IsNotEmpty({ message: 'Discount cant be empty' })
    @IsInt({ message: 'Discount must be between 1 and 100' })
    @Max(100, { message: 'Max Discount must be 100' })
    @Min(1, { message: 'Min Discount must be 1' })
    percentage!: number;

    @IsNotEmpty({ message: 'Expiration date is mandatory' })
    @IsDateString({}, { message: 'Expiration date must be a valid date string' })
    expirationDate!: Date;


}
