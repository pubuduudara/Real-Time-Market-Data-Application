import { AppDataSource } from "../config/database";
import dotenv from "dotenv";
import logger from "./utils/logger";
import { CryptoClient } from "./websockets/cryptoClient";

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connection established");

    const cryptoClient = new CryptoClient("wss://api.tiingo.com/crypto");
  })
  .catch((error) => {
    logger.error(`Error initializing database: ${error}`);
  });
