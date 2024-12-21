import WebSocket from "ws";
import logger from "../../utils/logger.utils";

export abstract class WebSocketClient {
  protected socket: WebSocket;

  constructor(private url: string) {
    this.socket = new WebSocket(this.url);
    this.setupConnection();
  }

  protected abstract handleMessage(data: any): void;

  protected abstract subscribe(): void;

  private setupConnection(): void {
    logger.info(`Setting up WebSocket connection`);

    this.socket.on("open", () => {
      logger.info("Connected to WebSocket");
      this.subscribe();
    });

    this.socket.on("close", (code: number, reason: string) => {
      logger.info(`Disconnected from WebSocket: ${code} - ${reason}`);
    });

    this.socket.on("message", (data: WebSocket.Data) => {
      try {
        const parsedData = JSON.parse(data.toString());
        this.handleMessage(parsedData);
      } catch (error) {
        logger.warn(`Failed to parse WebSocket data: ${error}`);
      }
    });

    this.socket.on("error", (error: Error) => {
      logger.error(`WebSocket error: ${error.message}`);
    });
  }
}
