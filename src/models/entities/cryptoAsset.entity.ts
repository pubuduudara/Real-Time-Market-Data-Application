/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: "CryptoAssets" })
export class CryptoAssetEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  ticker: string;

  @Column()
  createdAt: Date;
}
