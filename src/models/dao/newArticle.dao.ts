import { Repository } from "typeorm";
import { AppDataSource } from "../../../config/database";
import { NewsArticleEntity } from "../entities/newsArticle.entity";

/** This class is responsible for database operations connecting with the NewsArticle table */
export class NewsArticleDao {
  private repository: Repository<NewsArticleEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(NewsArticleEntity);
  }

  public async save(article: NewsArticleEntity): Promise<void> {
    await this.repository.save(article);
  }
}
