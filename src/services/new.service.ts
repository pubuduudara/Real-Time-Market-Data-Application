import { ApiClient } from "../api/apiClient";
import { NewsArticleDao } from "../models/dao/newArticle.dao";
import { ArticleTopicEntity } from "../models/entities/articleTopic.entity";
import { NewsArticleEntity } from "../models/entities/newsArticle.entity";
import { TickerSentimentEntity } from "../models/entities/tickerSentiment.entity";
import logger from "../utils/logger.utils";

export class NewsService {
  private apiClient: ApiClient;
  private newsArticleDao: NewsArticleDao;

  constructor() {
    this.apiClient = new ApiClient();
    this.newsArticleDao = new NewsArticleDao();
  }

  async fetchAndSaveNews(topics: string): Promise<void> {
    try {
      // Fetch news data using ApiClient
      const articlesData = await this.apiClient.fetchNewsSentiment(topics);

      // Save articles to the database
      for (const articleData of articlesData) {
        await this.saveArticle(articleData);
      }
    } catch (error) {
      logger.error("Error fetching or saving news:", error);
      throw error;
    }
  }

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
    article.authors = articleData.authors || [];
    article.summary = articleData.summary || null;
    article.bannerImage = articleData.banner_image || null;
    article.source = articleData.source;
    article.categoryWithinSource = articleData.category_within_source || null;
    article.sourceDomain = articleData.source_domain;
    article.overallSentimentScore = articleData.overall_sentiment_score || null;
    article.overallSentimentLabel = articleData.overall_sentiment_label || null;

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
}
