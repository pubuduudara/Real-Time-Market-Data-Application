import express from "express";
import cryptoMarketRouter from "./cryptoMarket.routes";
import newRouter from "./news.routes";
const router = express.Router();

// Combine routes
router.use("/", cryptoMarketRouter);
router.use("/", newRouter);

export default router;
