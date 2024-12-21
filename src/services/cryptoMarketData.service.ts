import { CryptoMarketDataDTO } from "../dto/cryptoMarketData.dto";
import { MarketTradeDao } from "../models/dao/cryptoTrade.dao";
import logger from "../utils/logger.utils";

export class CryptoMarketDataService {
  private buffer: CryptoMarketDataDTO[] = [];
  private bufferLimit: number;
  private flushInterval: number;
  private marketTradeDao: MarketTradeDao;

  constructor(bufferLimit: number, flushInterval: number) {
    this.marketTradeDao = new MarketTradeDao();
    this.bufferLimit = bufferLimit;
    this.flushInterval = flushInterval;
    this.startBufferFlush();
  }

  public async saveToBuffer(data: CryptoMarketDataDTO): Promise<void> {
    this.buffer.push(data);

    if (this.buffer.length >= this.bufferLimit) {
      await this.flushBufferToDatabase();
    }
  }

  private async flushBufferToDatabase(): Promise<void> {
    //TODO: add descriptive comment
    if (this.buffer.length === 0) return;

    const dataToSave = [...this.buffer];
    this.buffer = []; // clear the buffer before saving to handle incoming data during the save process

    try {
      logger.info(`Saving ${dataToSave.length} records to the database...`);
      await this.marketTradeDao.saveBatch(dataToSave);
    } catch (error) {
      logger.error("Failed to save buffer to database", error);
      this.buffer = [...dataToSave, ...this.buffer]; // restore unsaved data to the buffer
    }
  }

  private startBufferFlush(): void {
    setInterval(async () => {
      await this.flushBufferToDatabase();
    }, this.flushInterval);
  }
}
