import { IsNotEmpty, IsString } from "class-validator";

export class ApplyCouponDto {
    @IsNotEmpty({ message: 'Coupon name is required' })
    @IsString({ message: 'Coupon name must be a string' })
    name!: string;
}