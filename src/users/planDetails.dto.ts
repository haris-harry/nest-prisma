import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class PlanDetailsDto{
    @IsString()
    @IsNotEmpty()
    runningPlan: string;

}