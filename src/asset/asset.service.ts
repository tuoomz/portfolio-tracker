import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { ConfigService } from '@nestjs/config';
import * as CoinMarketCap from 'coinmarketcap-api';
import { error } from 'console';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
    private configService: ConfigService,
  ) {}

  async fetchAndInsertTickersFromCoinMarketCap() {
    const coinMarketCapApiKey = this.configService.get<string>(
      'coinmarketcapApiKey',
    );

    const client = new CoinMarketCap(coinMarketCapApiKey);

    try {
      // Fetch tickers from CoinMarketCap
      const tickers = await client.getTickers({ limit: 3 });

      // Map tickers to entities and insert them into the databaiterate over array typescriptse
      tickers.data.forEach((ticker) => {
        this.assetsRepository.upsert({ name: ticker.name }, ['id']);
      });

      return 'Tickers inserted successfully.';
    } catch (error) {
      throw new Error(
        'Error fetching and inserting tickers from CoinMarketCap' + error,
      );
    }
  }

  async getQuotesForTickers(tickerSymbols: string[]): Promise<any> {
    const coinMarketCapApiKey = this.configService.get<string>(
      'coinmarketcapApiKey',
    );
    const client = new CoinMarketCap(coinMarketCapApiKey);

    try {
      const quotes = await client.getQuotes({
        symbol: tickerSymbols.join(','),
      });
      console.log(quotes);
      return quotes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getQuoteForTicker(ticker: string): Promise<any> {
    const coinMarketCapApiKey = this.configService.get<string>(
      'coinmarketcapApiKey',
    );
    const client = new CoinMarketCap(coinMarketCapApiKey);

    try {
      const quotes = await client.getQuotes({ symbol: ticker });
      console.log(quotes);
      if (quotes.data && Object.keys(quotes.data).length > 0) {
        return Math.floor(
          quotes.data[ticker.toUpperCase()].quote.USD.price * 100,
        );
      } else {
        throw new Error("Can't get quotes" + error);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
