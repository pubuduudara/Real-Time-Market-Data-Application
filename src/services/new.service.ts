/**
 * Service for managing and processing news articles.
 * Handles fetching, saving, and querying news data.
 */
import { ApiClient } from "../api/apiClient";
import { NewsArticleDao } from "../models/dao/newArticle.dao";
import { ArticleTopicEntity } from "../models/entities/newsArticleTopic.entity";
import { NewsArticleEntity } from "../models/entities/newsArticle.entity";
import { TickerSentimentEntity } from "../models/entities/newsTickerSentiment.entity";
import logger from "../utils/logger.utils";
import { AuthorEntity } from "../models/entities/author.entity";
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
export class NewsService {
  private apiClient: ApiClient;
  private newsArticleDao: NewsArticleDao;

  constructor() {
    this.apiClient = new ApiClient();
    this.newsArticleDao = new NewsArticleDao();
  }

  /**
   * Fetches news articles and saves them to the database.
   * @returns {Promise<void>}
   * @throws {Error} - If fetching or saving data fails.
   */
  async fetchAndSaveNews(): Promise<void> {
    try {
      // Fetch news data using ApiClient
      const articlesData = await this.apiClient.fetchNewsSentiment();

      // Save articles to the database
      for (const articleData of articlesData) {
        await this.saveArticle(articleData);
      }
    } catch (error) {
      logger.error("Error fetching or saving news:", error);
      throw error;
    }
  }

  /**
   * Saves a news article to the database.
   * @param {any} articleData - The raw data of the article.
   * @returns {Promise<void>}
   */
  private async saveArticle(articleData: any): Promise<void> {
    // Parse and validate timePublished
    let timePublished: Date | null = null;
    if (articleData.time_published) {
      const parsedDate = new Date(articleData.time_published);
      if (!isNaN(parsedDate.getTime())) {
        timePublished = parsedDate;
      }
    }

    const article = new NewsArticleEntity();
    article.title = articleData.title;
    article.url = articleData.url;
    article.timePublished = timePublished;
    article.summary = articleData.summary || null;
    article.bannerImage = articleData.banner_image || null;
    article.source = articleData.source;
    article.categoryWithinSource = articleData.category_within_source || null;
    article.sourceDomain = articleData.source_domain;
    article.overallSentimentScore = articleData.overall_sentiment_score || null;
    article.overallSentimentLabel = articleData.overall_sentiment_label || null;

    article.authors = (articleData.authors || []).map((authorName: string) => {
      const author = new AuthorEntity();
      author.name = authorName;
      return author;
    });

    article.topics = (articleData.topics || []).map((topicData: any) => {
      const topic = new ArticleTopicEntity();
      topic.topic = topicData.topic;
      topic.relevanceScore = topicData.relevance_score;
      return topic;
    });

    article.tickerSentiments = (articleData.ticker_sentiment || []).map(
      (tickerData: any) => {
        const ticker = new TickerSentimentEntity();
        ticker.ticker = tickerData.ticker;
        ticker.relevanceScore = tickerData.relevance_score;
        ticker.tickerSentimentScore = tickerData.ticker_sentiment_score;
        ticker.tickerSentimentLabel = tickerData.ticker_sentiment_label;
        return ticker;
      }
    );

    await this.newsArticleDao.save(article);
  }

  /**
   * Retrieves all news articles with pagination.
   * @param {GetAllNewsParams} params - The pagination parameters.
   * @returns {Promise<any>} - The paginated news data and total count.
   */
  async getAllNews(params: GetAllNewsParams): Promise<any> {
    const [data, total] = await this.newsArticleDao.getAllNews(params);

    return { data, total };
  }

  /**
   * Retrieves news articles filtered by topics with pagination.
   * @param {GetNewsByTopicsParams} params - The filter and pagination parameters.
   * @returns {Promise<any>} - The filtered news data and total count.
   */
  public async getNewsByTopics(params: GetNewsByTopicsParams): Promise<any> {
    const { topics, page, pageSize } = params;

    const [data, total] = await this.newsArticleDao.getNewsByTopics({
      topics,
      page,
      pageSize,
    });
    return { data, total };
  }

  /**
   * Retrieves news articles filtered by author with pagination.
   * @param {GetNewsByAuthorParams} params - The filter and pagination parameters.
   * @returns {Promise<any>} - The filtered news data and total count.
   */
  public async getNewsByAuthor(params: GetNewsByAuthorParams): Promise<any> {
    const { author, page, pageSize } = params;

    const [data, total] = await this.newsArticleDao.getNewsByAuthor({
      author,
      page,
      pageSize,
    });
    return { data, total };
  }
}
