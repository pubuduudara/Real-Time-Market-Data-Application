/**
 * Controller class for managing crypto market price data.
 */
import { CryptoMarketDataService } from "../services/cryptoMarketData.service";
import { AppUtil } from "../utils/app.utils";
import { handleError, handleSuccess } from "../utils/responseHandler.utils";
import { Request, Response } from "express";

export class CryptoMarketPriceController {
  private cryptoMarketDataService: CryptoMarketDataService;
  constructor() {
    this.cryptoMarketDataService = new CryptoMarketDataService();
  }
  /**
   * Retrieves crypto market prices based on query parameters.
   *
   * @param {Request} req - The HTTP request object containing query parameters:
   *   - `tickers`: A comma-separated string of ticker symbols (optional).
   *   - `startDate`: The start date for the price data (optional).
   *   - `endDate`: The end date for the price data (optional).
   *   - `page`: The current page for pagination (optional).
   *   - `pageSize`: The number of items per page for pagination (optional).
   * @param {Response} res - The HTTP response object to send the results or errors.
   *
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   */
  public async getPrices(req: Request, res: Response): Promise<void> {
    try {
      const { tickers, startDate, endDate, page, pageSize } = req.query;

      const tickersArray = tickers ? (tickers as string).split(",") : undefined;
      const parsedStartDate = new Date(startDate as string);
      const parsedEndDate = AppUtil.parseDateOrDefault(endDate as string);
      const currentPage = parseInt(page as string, 10);
      const size = parseInt(pageSize as string, 10);
      const trades = await this.cryptoMarketDataService.getTradePrices(
        tickersArray,
        parsedStartDate,
        parsedEndDate,
        currentPage,
        size
      );

      handleSuccess(res, {
        trades: trades.data,
        total: trades.total,
        page: currentPage,
        pageSize: size,
      });
    } catch (err) {
      handleError(res, err);
    }
  }
}
