import { AppDataSource } from "../config/database";
import dotenv from "dotenv";
import { NewsService } from "./services/new.service";
import logger from "./utils/logger.utils";
dotenv.config();

(async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected");

    const newsService = new NewsService();

    await newsService.fetchAndSaveNews("blockchain");

    logger.info("News fetched and saved successfully");
  } catch (error) {
    logger.error("Error:", error);
  } finally {
    await AppDataSource.destroy();
  }
})();
