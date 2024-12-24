/**
 * WebSocket client for handling crypto market data from Tiingo.
 * Extends the `WebSocketClient` class and implements message handling and subscription logic.
 */
import { WebSocketClient } from "./abstract/webSocketClient";
import { CryptoMarketDataDTO } from "../../dto/cryptoMarketData.dto";
import logger from "../../utils/logger.utils";
import { CryptoMarketDataService } from "../../services/cryptoMarketData.service";

export class CryptoClient extends WebSocketClient {
  private cryptoMarketDataService: CryptoMarketDataService;

  /**
   * Initializes a CryptoClient instance.
   * @param {string} url - The WebSocket URL for the Tiingo crypto service.
   */
  constructor(url: string) {
    super(url);
    this.cryptoMarketDataService = new CryptoMarketDataService();
    this.cryptoMarketDataService.initializeBroadcaster(8080);
    this.cryptoMarketDataService.initializeBufferManager();
  }

  /**
   * Handles incoming WebSocket messages and processes market data.
   * Map incoming data to a DTO and add to a buffer
   * @param {any} data - The incoming message data.
   */
  protected async handleMessage(data: any): Promise<void> {
    try {
      const marketData: CryptoMarketDataDTO =
        CryptoMarketDataDTO.mapRawMessageToDto(data);
      await this.cryptoMarketDataService.addToBuffer(marketData);
    } catch (error) {
      logger.warn("Invalid market data format, skipping message.");
    }
  }

  /**
   * Subscribes to Tiingo crypto events via WebSocket.
   * Sends a subscription message to the WebSocket server.
   */
  protected subscribe(): void {
    const subscribe = {
      eventName: "subscribe",
      authorization: process.env.TINGO_AUTH_KEY,
      eventData: {
        thresholdLevel: 5, // will get only Last Trade updates
      },
    };
    this.socket.send(JSON.stringify(subscribe));
  }
}
