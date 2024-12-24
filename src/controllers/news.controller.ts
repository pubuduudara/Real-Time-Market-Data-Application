import { NewsService } from "../services/new.service";
import { handleError, handleSuccess } from "../utils/responseHandler.utils";
import { Request, Response } from "express";

export class NewsController {
  private newsService: NewsService;
  constructor() {
    this.newsService = new NewsService();
  }
  public async getAllNews(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = req.query;

      const news = await this.newsService.getAllNews({
        page: Number(page),
        pageSize: Number(pageSize),
      });

      //TODO: add response mapper DTOs

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
