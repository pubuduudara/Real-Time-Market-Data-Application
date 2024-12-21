/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: "CryptoTrades" })
export class CryptoTradeEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  ticker: string;

  @Column()
  timeStamp: Date;

  @Column()
  exchange: string;

  @Column()
  lastSize: number;

  @Column()
  lastPrice: number;
}

//TODO: add key constraints like uniqe keys