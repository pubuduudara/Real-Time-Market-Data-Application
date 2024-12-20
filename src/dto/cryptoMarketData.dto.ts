/** DTO class for raw Crypto Market Data */
export class CryptoMarketDataDTO {
  private service: string;
  private messageType: string;
  private type: string;
  private ticker: string;
  private timeStamp: Date;
  private exchange: string;
  private lastPrice: number;
  private lastSize: number;
  constructor(
    service: string,
    messageType: string,
    type: string,
    ticker: string,
    timeStamp: Date,
    exchange: string,
    lastPrice: number,
    lastSize: number
  ) {
    this.service = service;
    this.messageType = messageType;
    this.type = type;
    this.ticker = ticker;
    this.timeStamp = timeStamp;
    this.exchange = exchange;
    this.lastPrice = lastPrice;
    this.lastSize = lastSize;
  }

  // method to parse raw WebSocket data into a DTO instance
  static mapRawMessageToDto(message: any): CryptoMarketDataDTO {
    try {
      const { service, messageType, data } = message;

      if (!data || data.length !== 6) {
        throw new Error("Invalid message format in data section");
      }

      const [type, ticker, timeStamp, exchange, lastSize, lastPrice] = data;

      return new CryptoMarketDataDTO(
        service,
        messageType,
        type,
        ticker,
        timeStamp,
        exchange,
        lastSize.toString(),
        lastPrice.toString()
      );
    } catch (error) {
      throw new Error(
        `Failed to map raw data to CryptoMarketDataDTO: Error:${error}`
      );
    }
  }

  getService(): string {
    return this.service;
  }

  getMessageType(): string {
    return this.messageType;
  }

  getType(): string {
    return this.type;
  }

  getTicker(): string {
    return this.ticker;
  }

  getTimeStamp(): Date {
    return this.timeStamp;
  }

  getExchange(): string {
    return this.exchange;
  }

  getLastPrice(): number {
    return this.lastPrice;
  }

  getLastSize(): number {
    return this.lastSize;
  }
}
