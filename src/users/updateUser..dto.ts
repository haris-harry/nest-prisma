import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
 
export class UpdateUserDto {
  @IsNumber()
  id: number;
 
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}