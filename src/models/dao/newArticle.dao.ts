import { Repository } from "typeorm";
import { AppDataSource } from "../../../config/database";
import { NewsArticleEntity } from "../entities/newsArticle.entity";

interface GetAllNewsParams {
  page: number;
  pageSize: number;
}

/** This class is responsible for database operations connecting with the NewsArticle table */
export class NewsArticleDao {
  private repository: Repository<NewsArticleEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(NewsArticleEntity);
  }

  public async save(article: NewsArticleEntity): Promise<void> {
    await this.repository.save(article);
  }

  async getAllNews(params: GetAllNewsParams): Promise<any> {
    const { page, pageSize } = params;

    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize, // Calculate offset
      take: pageSize, // Limit the number of results
    });

    return [data, total];
  }
}
