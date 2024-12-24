import { CryptoMarketDataService } from "../services/cryptoMarketData.service";
import { AppUtil } from "../utils/app.utils";
import { handleError, handleSuccess } from "../utils/responseHandler.utils";
import { Request, Response } from "express";

export class CryptoMarketPriceController {
  private cryptoMarketDataService: CryptoMarketDataService;
  constructor() {
    this.cryptoMarketDataService = new CryptoMarketDataService();
  }
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
