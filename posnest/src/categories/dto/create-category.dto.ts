import { IsString, IsNotEmpty } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty({
        message: 'Name is required',
    })
    name!: string;
}
