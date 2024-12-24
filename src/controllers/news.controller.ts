import { NewsService } from "../services/new.service";
import { handleError, handleSuccess } from "../utils/responseHandler.utils";
import { Request, Response } from "express";

export class NewsController {
  private newsService: NewsService;
  constructor() {
    this.newsService = new NewsService();
  }
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = req.query;

      const news = await this.newsService.getAllNews({
        page: Number(page),
        pageSize: Number(pageSize),
      });

      handleSuccess(res, {
        news: news.data,
        total: news.total,
        page: Number(page),
        pageSize: Number(pageSize),
      });
    } catch (err) {
      handleError(res, err);
    }
  }

  public async getByTopic(req: Request, res: Response): Promise<void> {
    try {
      const { topics, page, pageSize } = req.query;

      const news = await this.newsService.getNewsByTopics({
        topics: String(topics).split(","),
        page: Number(page),
        pageSize: Number(pageSize),
      });

      handleSuccess(res, {
        news: news.data,
        total: news.total,
        page: Number(page),
        pageSize: Number(pageSize),
      });
    } catch (err) {
      handleError(res, err);
    }
  }
}
