import { WebSocketClient } from "./abstract/webSocketClient";
import { CryptoMarketDataDTO } from "../dto/cryptoMarketData.dto";
import logger from "../utils/logger";
import { CryptoMarketDataService } from "../services/cryptoMarketData.service";

export class CryptoClient extends WebSocketClient {
  private cryptoMarketDataService: CryptoMarketDataService;

  constructor(
    url: string,
    bufferLimit: number = 1000,
    flushInterval: number = 5000
  ) {
    super(url);
    this.cryptoMarketDataService = new CryptoMarketDataService(
      bufferLimit,
      flushInterval
    );
  }

  protected async handleMessage(data: any): Promise<void> {
    try {
      const marketData: CryptoMarketDataDTO =
        CryptoMarketDataDTO.mapRawMessageToDto(data);
      await this.cryptoMarketDataService.saveToBuffer(marketData);
    } catch (error) {
      logger.warn("Invalid market data format, skipping message.");
    }
  }

  protected subscribe(): void {
    const subscribe = {
      eventName: "subscribe",
      authorization: "2989ab75b4f34990ad7f6f38fff9e400d0a43ffc",
      eventData: {
        thresholdLevel: 2,
      },
    };
    this.socket.send(JSON.stringify(subscribe));
  }
}
