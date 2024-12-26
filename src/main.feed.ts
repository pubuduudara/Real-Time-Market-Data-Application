/**
 * One of the entry point in the project.
 * This script initializes the database connection, sets up environment variables,
 * and establishes a WebSocket connection to Tiingo's crypto WebSocket.
 */
import { AppDataSource } from "../config/database";
import dotenv from "dotenv";
import logger from "./utils/logger.utils";
import { CryptoClient } from "./websockets/subscribers/cryptoClient";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connection established");

    /**
     * Create a new CryptoClient instance for handling WebSocket data from Tiingo.
     * @param {string} process.env.CRYPTO_TIINGO_WEB_SOCKET - The WebSocket URL for Tiingo crypto service.
     */
    const cryptoClient = new CryptoClient(process.env.CRYPTO_TIINGO_WEB_SOCKET);
  })
  .catch((error) => {
    logger.error(`Error initializing database: ${error}`);
  });
