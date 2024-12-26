import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

// Create and export TypeORM DataSource
export const AppDataSource = new DataSource({
  type: process.env.NODE_ENV === "test" ? "sqlite" : "postgres",
  database: process.env.NODE_ENV === "test" ? ":memory:" : process.env.DB_NAME,
  host: process.env.NODE_ENV === "test" ? undefined : process.env.DB_HOST,
  port:
    process.env.NODE_ENV === "test"
      ? undefined
      : parseInt(process.env.DB_PORT || "5441"),
  username:
    process.env.NODE_ENV === "test" ? undefined : process.env.DB_USERNAME,
  password:
    process.env.NODE_ENV === "test" ? undefined : process.env.DB_PASSWORD,
  synchronize: process.env.NODE_ENV === "test", // Automatically sync schema in tests
  logging: false,
  entities: ["src/models/**/*.ts"], // Adjust this to your project structure
});
