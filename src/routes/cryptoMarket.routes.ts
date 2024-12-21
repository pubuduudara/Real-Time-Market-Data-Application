import express from "express";
import { CryptoMarketPriceController } from "../controllers/cryptoMarketPrice.controller";
import { validateRequest } from "../middlewares/requestValidator";
import { cryptoPricesSchema } from "../requestSchemas/cryptoPrices.schema";

const router = express.Router();

router.get(
  "/crypto/prices",
  validateRequest(cryptoPricesSchema, "query"),
  CryptoMarketPriceController.getPrices
);

export default router;
