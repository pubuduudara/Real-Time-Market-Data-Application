import { AppDataSource } from "../config/database";
import dotenv from "dotenv";
import logger from "./utils/logger.utils";
import express from "express";
import AppRoutes from "./routes/app.routes";
dotenv.config();

const PORT = process.env.API_PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connection established");

    const app = express();
    app.use(express.json());

    app.use("/", AppRoutes);

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Error initializing database: ${error}`);
  });
