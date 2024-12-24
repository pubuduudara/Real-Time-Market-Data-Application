import { Between, In, Repository } from "typeorm";
import { AppDataSource } from "../../../config/database";
import { CryptoTradeEntity } from "../entities/cryptoTrade.entity";
import { CryptoMarketDataDTO } from "../../dto/cryptoMarketData.dto";

/** This class is responsible for database operations connecting with the CryptoTrades table */
export class CryptoTradeDao {
  private repository: Repository<CryptoTradeEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(CryptoTradeEntity);
  }

  /**
   * Maps a CryptoMarketDataDTO to a CryptoTradeEntity.
   * @param {CryptoMarketDataDTO} dto - The DTO to map.
   * @returns {CryptoTradeEntity} - The mapped entity.
   */
  private mapDtoToEntity(dto: CryptoMarketDataDTO): CryptoTradeEntity {
    const entity = new CryptoTradeEntity();
    entity.ticker = dto.getTicker();
    entity.timeStamp = dto.getTimeStamp();
    entity.exchange = dto.getExchange();
    entity.lastSize = dto.getLastSize();
    entity.lastPrice = dto.getLastPrice();
    return entity;
  }

  /**
   * Saves multiple MarketDataBuffer records to the database in a batch.
   * @param {CryptoMarketDataDTO[]} data - An array of records to be saved.
   * @returns {Promise<CryptoTradeEntity[]>} - The saved records.
   */
  public async saveBatch(
    data: CryptoMarketDataDTO[]
  ): Promise<CryptoTradeEntity[]> {
    const entities = data.map((dto) => this.mapDtoToEntity(dto));
    return await this.repository.save(entities);
  }

  /**
   * Fetches trades by a date range and ticker(s).
   * @param {string[]} tickers - The list of tickers to filter (optional)
   * @param {Date} startDate - The start date of the range
   * @param {Date} endDate - The end date of the range
   * @returns {Promise<[CryptoTradeEntity[], number]>} - The filtered trades.
   */
  public async getTradesByDateRange(
    tickers: string[] | undefined,
    startDate: Date,
    endDate: Date,
    page: number,
    pageSize: number
  ): Promise<[CryptoTradeEntity[], number]> {
    const whereClause: any = {
      timeStamp: Between(startDate, endDate),
    };

    if (tickers && tickers.length > 0) {
      whereClause.ticker = In(tickers);
    }

    const [data, total] = await this.repository.findAndCount({
      where: whereClause,
      order: {
        timeStamp: "ASC",
      },
      skip: (page - 1) * pageSize, // Calculate offset
      take: pageSize, // Limit the number of results
    });

    return [data, total];
  }
}
