import { AppDataSource } from "../config/database";
import dotenv from "dotenv";
import logger from "./utils/logger.utils";
import express from "express";
import AppRoutes from "./routes/app.routes";
import { authenticateApiKey } from "./middlewares/auth.middleware";
import { setupSwagger } from "./swagger";
dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const PORT = process.env.API_PORT || 3000;

const app = express(); // Create the Express app
app.use(express.json());
app.use(authenticateApiKey); // Apply authentication middleware to all API routes
app.use("/", AppRoutes);
setupSwagger(app);

// Only start the server if not in a test environment
if (process.env.NODE_ENV !== "test") {
  AppDataSource.initialize()
    .then(() => {
      logger.info("Database connection established");

      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      logger.error(`Error initializing database: ${error}`);
    });
}

export default app; // Export the app for testing
