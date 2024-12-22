import { CryptoMarketDataDTO } from "../dto/cryptoMarketData.dto";
import { CryptoAssetDao } from "../models/dao/cryptoAsset.dao";
import { CryptoTradeDao } from "../models/dao/cryptoTrade.dao";
import { CryptoTradeEntity } from "../models/entities/cryptoTrade.entity";
import logger from "../utils/logger.utils";
import { WebSocketServer } from "../websockets/publishers/webSocketServer";
import { BufferManager } from "./bufferManager.service";

export class CryptoMarketDataService {
  private bufferManager: BufferManager<CryptoMarketDataDTO>;
  private cryptoTradeDao: CryptoTradeDao;
  private cryptoAssetDao: CryptoAssetDao;
  private bufferLimit = 100;
  private flushInterval = 5000;
  private broadcaster: WebSocketServer;

  constructor() {
    this.cryptoTradeDao = new CryptoTradeDao();
    this.cryptoAssetDao = new CryptoAssetDao();
    this.bufferManager = new BufferManager<CryptoMarketDataDTO>(
      this.bufferLimit,
      this.flushInterval,
      this.flushBufferToDatabase.bind(this)
    );
    this.broadcaster = new WebSocketServer(8080);
  }

  private async flushBufferToDatabase(
    data: CryptoMarketDataDTO[]
  ): Promise<void> {
    try {
      logger.info(`Saving ${data.length} records to the database...`);
      await this.cryptoTradeDao.saveBatch(data);
      //TODO: format message structure before sending the frontend
      this.broadcaster.broadcast(data);
    } catch (error) {
      logger.error("Failed to save data to the database", error);
      throw new Error(); // Let the BufferManager handle retries
    }
  }

  public async addToBuffer(data: CryptoMarketDataDTO): Promise<void> {
    await this.bufferManager.addToBuffer(data);
  }

  /**
   * Gets trade prices with optional tickers and pagination.
   * @param {string[]} tickers - The list of tickers to filter (optional)
   * @param {Date} startDate - The start date of the range
   * @param {Date} endDate - The end date of the range
   * @returns {Promise<{ data: CryptoTradeEntity[]; total: number }>} - Paginated trade prices.
   */
  public async getTradePrices(
    tickers: string[] | undefined,
    startDate: Date,
    endDate: Date,
    page: number,
    pageSize: number
  ): Promise<{ data: CryptoTradeEntity[]; total: number }> {
    // Validate tickers if provided
    if (tickers && tickers.length > 0) {
      for (const ticker of tickers) {
        const tickerEntity = await this.cryptoAssetDao.getByTicker(ticker);
        if (!tickerEntity) {
          throw new Error(`Invalid ticker: ${ticker}`);
        }
      }
    }

    const [data, total] = await this.cryptoTradeDao.getTradesByDateRange(
      tickers,
      startDate,
      endDate,
      page,
      pageSize
    );

    return { data, total };
  }
}
