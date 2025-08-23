import {
  IsString,
  IsOptional,
  IsNumber,
  IsUrl,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  preco?: number;

  @IsOptional()
  @IsUrl()
  url_imagem?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantidade_em_stock?: number;
}
