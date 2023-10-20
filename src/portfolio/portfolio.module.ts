import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { Portfolio, Position } from './portfolio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetService } from 'src/asset/asset.service';
import { Asset } from 'src/asset/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, Position, Asset])],
  controllers: [PortfolioController],
  providers: [PortfolioService, AssetService],
})
export class PortfolioModule {}
