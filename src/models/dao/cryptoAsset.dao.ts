import { Repository } from "typeorm";
import { AppDataSource } from "../../../config/database";
import { CryptoAssetEntity } from "../entities/cryptoAsset.entity";

/** This class is responsible for database operations connecting with the CryptoAssets table */
export class CryptoAssetDao {
  private repository: Repository<CryptoAssetEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(CryptoAssetEntity);
  }

  /**
   * Get crypto asset by ticker
   * @param {string} ticker - ticker name
   * @returns {CryptoAssetEntity} - crypto asset entity for the given ticker
   */
  public getByTicker(ticker: string): Promise<CryptoAssetEntity> {
    return this.repository.findOne({
      where: { ticker },
    });
  }
}
