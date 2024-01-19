import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString({})
  currency: string;

  @IsNotEmpty()
  @IsNumber({})
  @Min(10)
  @Max(1000)
  amount: number;
}
