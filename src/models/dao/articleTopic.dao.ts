import { Repository } from "typeorm";
import { AppDataSource } from "../../../config/database";
import { ArticleTopicEntity } from "../entities/articleTopic.entity";

/** This class is responsible for database operations connecting with the Article Topic table */
export class ArticleTopicDao {
  private repository: Repository<ArticleTopicEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ArticleTopicEntity);
  }
}
