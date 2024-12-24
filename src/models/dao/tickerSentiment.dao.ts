import { Repository } from "typeorm";
import { AppDataSource } from "../../../config/database";
import { TickerSentimentEntity } from "../entities/newsTickerSentiment.entity";

/** This class is responsible for database operations connecting with the Ticker Sentiment table */
export class TickerSentimentDao {
  private repository: Repository<TickerSentimentEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(TickerSentimentEntity);
  }
}
