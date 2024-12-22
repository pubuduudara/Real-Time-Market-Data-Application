import { AppDataSource } from "../config/database";
import dotenv from "dotenv";
import logger from "./utils/logger.utils";
import { CryptoClient } from "./websockets/subscribers/cryptoClient";

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connection established");

    //TODO: add websocket API to env variables
    const cryptoClient = new CryptoClient("wss://api.tiingo.com/crypto");
  })
  .catch((error) => {
    logger.error(`Error initializing database: ${error}`);
  });
