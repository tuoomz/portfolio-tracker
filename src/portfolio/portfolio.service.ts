import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Position, PortfolioType } from './portfolio.entity';
import { AssetService } from 'src/asset/asset.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
    private readonly assetService: AssetService, // Inject AssetService
  ) {}

  async createPortfolio(name: string, type: PortfolioType): Promise<Portfolio> {
    const portfolio = this.portfolioRepository.create({ name, type });
    portfolio.ethPrice = await this.assetService.getQuoteForTicker('ETH');

    // Create and associate positions with the portfolio

    return await this.portfolioRepository.save(portfolio);
  }

  async deletePortfolioById(id: number) {
    // Find the portfolio by its ID
    const portfolioToDelete = await this.portfolioRepository.findOne({
      where: {
        id,
      },
    });

    if (!portfolioToDelete) {
      throw new NotFoundException('Portfolio not found');
    }

    // Delete associated positions (if any)
    return await this.portfolioRepository.delete(portfolioToDelete);
  }

  async findAllPortfolios(): Promise<Portfolio[]> {
    return await this.portfolioRepository.find({ relations: ['positions'] });
  }

  private async addAssetToPortfolio(
    id: number,
    ticker: string,
    value: number,
    propertyName: string,
  ) {
    const position = new Position();
    position[propertyName] = value;
    position.ticker = ticker;

    try {
      position.purchacePrice =
        await this.assetService.getQuoteForTicker(ticker);
    } catch (error) {
      throw new Error(`Ticker ${ticker} not found`);
    }

    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['positions'],
    });

    if (portfolio.type != propertyName) {
      throw new Error('Position incompatible with portfoilio');
    }

    if (portfolio) {
      portfolio.positions.push(position);
      return await this.portfolioRepository.save(portfolio);
    } else {
      throw new Error(`Portfolio not found with id: ${id}`);
    }
  }

  async addAssetToPortfolioByAmount(
    id: number,
    ticker: string,
    amount: number,
  ) {
    return this.addAssetToPortfolio(id, ticker, amount, PortfolioType.AMOUNT);
  }

  async addAssetToPortfolioByWeight(
    id: number,
    ticker: string,
    weight: number,
  ) {
    return this.addAssetToPortfolio(id, ticker, weight, PortfolioType.WEIGHT);
  }
  async deletePositionFromPortfolio(id: number) {
    return await this.positionRepository.delete({ id });
  }
  async calculatePortfolioROI(
    id: number,
  ): Promise<{ increaseUSD: number; increaseETH: number }> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['positions'],
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio not found with id: ${id}`);
    }

    let totalValue = 0;
    let initialValue = 0;

    if (portfolio.type == PortfolioType.AMOUNT) {
      for (const position of portfolio.positions) {
        const value =
          portfolio.type == PortfolioType.AMOUNT
            ? position.amount
            : position.weight;
        const quote = await this.assetService.getQuoteForTicker(
          position.ticker,
        );
        totalValue += value * quote;
        initialValue += value * position.purchacePrice;
      }
    }

    const ethCurrentPrice = await this.assetService.getQuoteForTicker('ETH');
    const startingEthPrice = portfolio.ethPrice;
    const ethPriceChanegPct =
      ((ethCurrentPrice - startingEthPrice) / startingEthPrice) * 100;

    const pctIncreaseVsUSD = ((totalValue - initialValue) / initialValue) * 100;

    const pctIncreaseVsETH =
      ((pctIncreaseVsUSD - ethPriceChanegPct) / ethPriceChanegPct) * 100;

    return {
      increaseUSD: pctIncreaseVsUSD,
      increaseETH: pctIncreaseVsETH,
    };
  }
}
