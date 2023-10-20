// eslint-disable-next-line prettier/prettier

import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { PortfolioType } from '../portfolio.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEnum(PortfolioType)
  type: PortfolioType;
}

export class CreatePortfolioAssetDto {
  // Define properties for assets
}

export class CreatePortfolioByAmountDto {
  name: string;
  assets: Array<{ ticker: string; value: number }>;
}

export class CreatePortfolioByPercentageDto {
  name: string;
  assets: Array<{ ticker: string; percentage: number }>;
}
