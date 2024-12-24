/**
 * Service for managing crypto assets.
 * Provides methods for retrieving and handling crypto asset data.
 */

import { CryptoAssetDao } from "../models/dao/cryptoAsset.dao";
import { CryptoAssetEntity } from "../models/entities/cryptoAsset.entity";
import logger from "../utils/logger.utils";

export class CryptoAssetService {
  private cryptoAssetDao: CryptoAssetDao;

  constructor() {
    this.cryptoAssetDao = new CryptoAssetDao();
  }

  /**
   * Get crypto asset by ticker
   * @param {string} ticker - ticker name
   * @returns {CryptoAssetEntity} - crypto asset entity for the given ticker
   */
  public async getByTicker(ticker: string): Promise<CryptoAssetEntity> {
    const cryptoAsset = await this.cryptoAssetDao.getByTicker(ticker);
    if (!cryptoAsset) {
      const error = `crypto asset for ticker ${ticker} does not exist`;
      logger.error(error);
      throw new Error(error);
    }
    return cryptoAsset;
  }
}
