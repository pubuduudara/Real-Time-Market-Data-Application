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

  @Column("decimal")
  lastSize: number;

  @Column("decimal")
  lastPrice: number;
}
