import { Repository } from "typeorm";
import { AppDataSource } from "../../../config/database";
import { NewsArticleEntity } from "../entities/newsArticle.entity";

interface GetAllNewsParams {
  page: number;
  pageSize: number;
}
interface GetNewsByTopicsParams {
  topics: string[];
  page: number;
  pageSize: number;
}

interface GetNewsByAuthorParams {
  author: string;
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

  public async getAllNews(params: GetAllNewsParams): Promise<any> {
    const { page, pageSize } = params;

    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize, // Calculate offset
      take: pageSize, // Limit the number of results
    });

    return [data, total];
  }

  public async getNewsByTopics(params: GetNewsByTopicsParams): Promise<any> {
    const { topics, page, pageSize } = params;

    const queryBuilder = this.repository.createQueryBuilder("news");

    // Join the topics table and filter by topics
    queryBuilder
      .innerJoinAndSelect("news.topics", "topics")
      .leftJoinAndSelect("news.authors", "authors")
      .leftJoinAndSelect("news.tickerSentiments", "tickerSentiments")
      .where("topics.topic IN (:...topics)", { topics })
      .take(pageSize)
      .skip((page - 1) * pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    const transformedData = data.map((article) => {
      const { topics, ...rest } = article; // Destructure and exclude the 'topics' field
      return rest;
    });

    return [transformedData, total];
  }

  public async getNewsByAuthor(params: GetNewsByAuthorParams): Promise<any> {
    const { author, page, pageSize } = params;
    const queryBuilder = this.repository.createQueryBuilder("news");

    queryBuilder
      .innerJoinAndSelect("news.authors", "authors") // Join with the authors table
      .leftJoinAndSelect("news.tickerSentiments", "tickerSentiments") // Include ticker sentiments
      .where("authors.name = :author", { author }) // Use direct comparison
      .take(pageSize) // Limit results
      .skip((page - 1) * pageSize); // Offset for pagination

    const [data, total] = await queryBuilder.getManyAndCount();

    const transformedData = data.map((article) => {
      const { topics, ...rest } = article; // Destructure and exclude the 'topics' field
      return rest;
    });

    return [transformedData, total];
  }
}
