import { Repository } from "typeorm";
import { AppDataSource } from "../../../config/database";
import { CryptoTradeEntity } from "../entities/cryptoTrade.entity";
import { CryptoMarketDataDTO } from "../../dto/cryptoMarketData.dto";

/** This class is responsible for database operations connecting with the CryptoTrades table */
export class MarketTradeDao {
  private repository: Repository<CryptoTradeEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(CryptoTradeEntity);
  }

  /**
   * TODO: move this to a seperate mapper folder
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
}
