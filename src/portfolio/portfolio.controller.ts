// portfolio.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getAllPortfolios() {
    return await this.portfolioService.findAllPortfolios();
  }

  @Post()
  @ApiBody({
    type: () => CreatePortfolioDto,
    description:
      'The name and type of portfolio, can be either value or percentage',
    examples: {
      values: {
        summary: 'My Portfolio By Weight',
        value: { name: 'My Portfolio', type: 'weight' },
      },
    },
  })
  async createPortfolio(@Body() payload: CreatePortfolioDto) {
    const { name, type } = payload;
    return await this.portfolioService.createPortfolio(name, type);
  }

  @Put(':id')
  updatePortfolio() {
    // Implement logic to update a portfolio by ID
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio' })
  @ApiParam({ name: 'id', type: Number, description: 'Portfolio ID' })
  async deletePortfolio(@Param('id') id: number) {
    try {
      const deletedPortfolio =
        await this.portfolioService.deletePortfolioById(id);
      if (deletedPortfolio) {
        return { message: 'Delete successful', id: id };
      } else {
        throw new HttpException(
          'Unable to delete portfolio',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('position/')
  @ApiOperation({ summary: 'Add position to a portfolio' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        ticker: { type: 'string', example: 'ETH' },
        amount: { type: 'number', example: 10 },
        percentage: { type: 'number', example: 10 },
      },
    },
  })
  async addPositionToPortfolio(
    @Body()
    payload: {
      id: number;
      ticker: string;
      amount?: number;
      percentage?: number;
    },
  ) {
    try {
      const { id, ticker, amount, percentage } = payload;
      if (amount) {
        return await this.portfolioService.addAssetToPortfolioByAmount(
          id,
          ticker,
          amount,
        );
      } else {
        return await this.portfolioService.addAssetToPortfolioByWeight(
          id,
          ticker,
          percentage,
        );
      }
    } catch (error) {
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('position/:id')
  @ApiOperation({ summary: 'Remove positions from portfolio' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Position ID',
    example: 1,
  })
  async removePositionFromPortfolio(@Param('id') id: number) {
    try {
      await this.portfolioService.deletePositionFromPortfolio(id);
      return { message: 'Delete successful', id: id };
    } catch (error) {
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/roi')
  @ApiParam({ name: 'id', type: 'number' })
  async getPortfolioROI(@Param('id') id: number) {
    try {
      return await this.portfolioService.calculatePortfolioROI(id);
    } catch (error) {
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
