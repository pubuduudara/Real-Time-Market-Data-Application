import { AppUtil } from "../utils/app.utils";
import { handleError, handleSuccess } from "../utils/responseHandler.utils";
import { Request, Response } from "express";

export class CryptoMarketPriceController {
  public static async getPrices(req: Request, res: Response): Promise<void> {
    try {
      const { tickers, startDate, endDate } = req.query;

      // Parse tickers
      const tickersArray = (tickers as string).split(",");
      const parsedStartDate = new Date(startDate as string);
      const parsedEndDate = AppUtil.parseDateOrDefault(endDate as string);
      // Mock data fetch for demonstration
      const prices = [
        {
          ticker: "a",
          price: 950.45,
          timestamp: parsedStartDate.toISOString(),
        },
        {
          ticker: "b",
          price: 123.55,
          timestamp: parsedEndDate.toISOString(),
        },
      ];
      handleSuccess(res, prices);
    } catch (err) {
      handleError(res, err);
    }
  }
}
