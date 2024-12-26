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
    /**
     * @swagger
     * /crypto/prices:
     *   get:
     *     summary: Retrieve real-time crypto market data
     *     description: Fetch real-time cryptocurrency market data based on provided filters. An API key is required for authorization.
     *     security:
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: query
     *         name: tickers
     *         schema:
     *           type: string
     *           pattern: "^[a-zA-Z,]+$"
     *         required: false
     *         description: A comma-separated list of tickers (e.g., usdcusdt,theusdt). Only alphabets are allowed.
     *       - in: query
     *         name: startDate
     *         schema:
     *           type: string
     *           format: date
     *           pattern: "^\\d{4}-\\d{2}-\\d{2}$"
     *         required: true
     *         description: The start date for fetching market data in the format YYYY-MM-DD.
     *       - in: query
     *         name: endDate
     *         schema:
     *           type: string
     *           format: date
     *           pattern: "^\\d{4}-\\d{2}-\\d{2}$"
     *         required: false
     *         description: The end date for fetching market data in the format YYYY-MM-DD.
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         required: false
     *         description: The page number for pagination (must be at least 1).
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 10
     *         required: false
     *         description: The number of results per page (must be at least 1).
     *     responses:
     *       200:
     *         description: Successfully retrieved market data.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     trades:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           id:
     *                             type: string
     *                             example: "c4c66586-d145-4e5d-b560-28e060c29cb1"
     *                           ticker:
     *                             type: string
     *                             example: "usdcusdt"
     *                           timeStamp:
     *                             type: string
     *                             format: date-time
     *                             example: "2024-12-24T16:21:13.000Z"
     *                           exchange:
     *                             type: string
     *                             example: "curvefipolygon"
     *                           lastSize:
     *                             type: number
     *                             example: 1.0009762439607752
     *                           lastPrice:
     *                             type: number
     *                             example: 7617.377724
     *                     total:
     *                       type: integer
     *                       example: 128
     *                     page:
     *                       type: integer
     *                       example: 1
     *                     pageSize:
     *                       type: integer
     *                       example: 5
     *       400:
     *         description: Invalid input parameters.
     *       401:
     *         description: Unauthorized - API key is missing or invalid.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Unauthorized: API key is missing"
     *       500:
     *         description: Internal server error.
     * components:
     *   securitySchemes:
     *     ApiKeyAuth:
     *       type: apiKey
     *       in: header
     *       name: x-api-key
     */
    this.router.get(
      "/crypto/prices",
      validateRequest(cryptoPricesSchema, "query"),
      (req, res) => this.cryptoMarketPriceController.getPrices(req, res)
    );
  }
}

export default new CryptoMarketPriceRoutes().router;
