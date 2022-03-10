import { IsString, IsNotEmpty, IsInt } from 'class-validator';
 
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  runningPlan: string;

  @IsInt()
  @IsNotEmpty()
  cvc: number;

  planStartDate: Date

  @IsString()
  @IsNotEmpty()
  cardNumber: string

  @IsNotEmpty()
  expiryDate: Date

  @IsString()
  stipeSourceId: string

  @IsString()
  stripeCustomerId: string
}