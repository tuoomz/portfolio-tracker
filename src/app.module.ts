import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetModule } from './asset/asset.module';
import { ConfigModule } from '@nestjs/config';
import { Asset } from './asset/asset.entity';
import { AssetService } from './asset/asset.service';
import config from '../config/app.config';
import { PortfolioService } from './portfolio/portfolio.service';
import { Portfolio, Position } from './portfolio/portfolio.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config], }),
    TypeOrmModule.forFeature([Asset, Position, Portfolio]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'amulet',
      password: 'postgrespw',
      username: 'postgres',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    PortfolioModule,
    AssetModule,
  ],
  controllers: [AppController],
  providers: [AppService, PortfolioService, AssetService],
})
export class AppModule { }
