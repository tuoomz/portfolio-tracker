import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Asset])],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
