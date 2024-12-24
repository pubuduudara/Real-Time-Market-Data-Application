import axios from "axios";
import logger from "../utils/logger.utils";

export class ApiClient {
  //TODO make this class more nicer
  async fetchNewsSentiment(): Promise<any[]> {
    try {
      const response = await axios.get(process.env.NEWS_API_HOST, {
        params: {
          function: "NEWS_SENTIMENT",
          apikey: process.env.NEWS_API_KEY,
        },
      });

      if (!response.data || !response.data.feed) {
        throw new Error("Invalid API response");
      }

      return response.data.feed;
    } catch (error) {
      logger.error("Error fetching news:", error);
      throw error;
    }
  }
}
