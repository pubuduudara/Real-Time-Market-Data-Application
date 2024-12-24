import express from "express";
import { validateRequest } from "../middlewares/requestValidator";
import { NewsController } from "../controllers/news.controller";
import { getAllNewsSchema } from "../requestSchemas/news.schema";

class NewsRoutes {
  public router: express.Router;
  private newsController: NewsController;

  constructor() {
    this.router = express.Router();
    this.newsController = new NewsController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/news",
      validateRequest(getAllNewsSchema, "query"),
      (req, res) => this.newsController.getAllNews(req, res)
    );
  }
}

export default new NewsRoutes().router;
