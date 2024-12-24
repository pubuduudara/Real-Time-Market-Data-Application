/**
 * Service for managing crypto market data
 */
import { CryptoMarketDataDTO } from "../dto/cryptoMarketData.dto";
import { CryptoAssetDao } from "../models/dao/cryptoAsset.dao";
import { CryptoTradeDao } from "../models/dao/cryptoTrade.dao";
import { CryptoTradeEntity } from "../models/entities/cryptoTrade.entity";
import logger from "../utils/logger.utils";
import { WebSocketServer } from "../websockets/publishers/webSocketServer";
import { BufferManager } from "./bufferManager.service";

export class CryptoMarketDataService {
  private bufferManager: BufferManager<CryptoMarketDataDTO> | null = null; // Manages buffered data and its periodic flush
  private cryptoTradeDao: CryptoTradeDao;
  private cryptoAssetDao: CryptoAssetDao;
  private bufferLimit = 100; // Maximum buffer size before flushing data to database
  private flushInterval = 5000; //Interval for flushing buffer to the database (in milliseconds)
  private broadcaster: WebSocketServer | null = null;

  /**
   * Initializes the CryptoMarketDataService.
   * Sets up DAOs, buffer management, and WebSocket broadcasting.
   */
  constructor() {
    this.cryptoTradeDao = new CryptoTradeDao();
    this.cryptoAssetDao = new CryptoAssetDao();
  }

  /**
   * Initializes the BufferManager.
   */
  public initializeBufferManager(): void {
    if (this.bufferManager) {
      logger.warn("BufferManager is already initialized");
      return;
    }
    this.bufferManager = new BufferManager<CryptoMarketDataDTO>(
      this.bufferLimit,
      this.flushInterval,
      this.flushBufferToDatabase.bind(this)
    );
    logger.info("BufferManager initialized successfully");
  }

  /**
   * Initializes the WebSocket Broadcaster.
   * @param port - Port number for WebSocket server
   */
  public initializeBroadcaster(port: number): void {
    if (this.broadcaster) {
      logger.warn("Broadcaster is already initialized");
      return;
    }
    this.broadcaster = new WebSocketServer(port);
    logger.info(`Broadcaster initialized on port ${port}`);
  }

  /**
   * Flushes buffered data to the database and broadcasts updates.
   * @param {CryptoMarketDataDTO[]} data - The buffered data to save and broadcast.
   * @returns {Promise<void>}
   */
  private async flushBufferToDatabase(
    data: CryptoMarketDataDTO[]
  ): Promise<void> {
    try {
      await this.cryptoTradeDao.saveBatch(data);
      this.broadcaster.broadcast(data);
      logger.info(
        `Saving ${data.length} records to the database completed and broadcast to frontend`
      );
    } catch (error) {
      logger.error("Failed to save data to the database", error);
      throw new Error();
    }
  }

  /**
   * Adds a single market data record to the buffer.
   * @param {CryptoMarketDataDTO} data - The market data to buffer.
   * @returns {Promise<void>}
   */
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
