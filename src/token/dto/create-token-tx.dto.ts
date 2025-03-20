import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateTokenTxDto {
  @IsNumber()
  amount: number

  @IsOptional()
  @IsString()
  comment?: string
}
