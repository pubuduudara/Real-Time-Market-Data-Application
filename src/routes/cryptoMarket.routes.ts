import express from "express";
import { CryptoMarketPriceController } from "../controllers/cryptoMarketPrice.controller";
import { validateRequest } from "../middlewares/requestValidator";
import { cryptoPricesSchema } from "../requestSchemas/cryptoPrices.schema";

class CryptoMarketPriceRoutes {
  public router: express.Router;
  private cryptoMarketPriceController: CryptoMarketPriceController;

  constructor() {
    this.router = express.Router();
    this.cryptoMarketPriceController = new CryptoMarketPriceController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/crypto/prices",
      validateRequest(cryptoPricesSchema, "query"),
      (req, res) => this.cryptoMarketPriceController.getPrices(req, res)
    );
  }
}

export default new CryptoMarketPriceRoutes().router;
