import { CryptoMarketDataDTO } from "../dto/cryptoMarketData.dto";
import { MarketTradeDao } from "../models/dao/cryptoTrade.dao";
import logger from "../utils/logger.utils";
import { BufferManager } from "./bufferManager.service";

export class CryptoMarketDataService {
  private bufferManager: BufferManager<CryptoMarketDataDTO>;
  private marketTradeDao: MarketTradeDao;
  private bufferLimit = 100;
  private flushInterval = 5000;

  constructor() {
    this.marketTradeDao = new MarketTradeDao();
    this.bufferManager = new BufferManager<CryptoMarketDataDTO>(
      this.bufferLimit,
      this.flushInterval,
      this.flushBufferToDatabase.bind(this)
    );
  }

  public async addToBuffer(data: CryptoMarketDataDTO): Promise<void> {
    await this.bufferManager.addToBuffer(data);
  }

  private async flushBufferToDatabase(
    data: CryptoMarketDataDTO[]
  ): Promise<void> {
    try {
      logger.info(`Saving ${data.length} records to the database...`);
      await this.marketTradeDao.saveBatch(data);
    } catch (error) {
      logger.error("Failed to save data to the database", error);
      throw new Error(); // Let the BufferManager handle retries
    }
  }
}
