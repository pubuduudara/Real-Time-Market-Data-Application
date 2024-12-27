import express from "express";
import cryptoMarketRouter from "./cryptoMarket.routes";
class AppRoutes {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Combine routes
    this.router.use("/", cryptoMarketRouter);
  }
}

export default new AppRoutes().router;
