import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['weight', 'amount'],
    default: 'amount',
  })
  type: PortfolioType;

  @OneToMany(() => Position, (position) => position.portfolio, {
    cascade: true,
  })
  positions: Position[];

  @Column({
    type: 'integer',
    comment:
      'Eth price is cents, this is be the marker for the portfolio to beat',
    nullable: true,
  })
  ethPrice?: number;
}

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' }) // Set default value to today's date
  purchaseDate: Date;

  @Column({ type: 'integer', comment: 'price in cents usd' })
  purchacePrice: number;

  @Column({
    type: 'integer',
    comment: 'Number of whole units owned',
    nullable: true,
  })
  amount?: number;

  @Column({
    type: 'integer',
    comment: 'Weight of portfolio allocated to to this position',
    nullable: true,
  })
  weight?: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.positions, {
    onDelete: 'CASCADE',
  })
  portfolio: Portfolio;
}

export enum PortfolioType {
  WEIGHT = 'weight',
  AMOUNT = 'amount',
}
