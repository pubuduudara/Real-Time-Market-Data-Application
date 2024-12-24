/**
 * Abstract class for managing WebSocket connections.
 * Provides a base implementation for setting up a WebSocket and handling lifecycle events.
 * Subclasses must implement `handleMessage` and `subscribe` methods.
 */
import WebSocket from "ws";
import logger from "../../../utils/logger.utils";

export abstract class WebSocketClient {
  protected socket: WebSocket;

  /**
   * Initializes a WebSocketClient instance and sets up the WebSocket connection.
   * @param {string} url - The WebSocket server URL.
   */
  constructor(private url: string) {
    this.socket = new WebSocket(this.url);
    this.setupConnection();
  }

  /**
   * Abstract method for handling incoming WebSocket messages.
   * Must be implemented by subclasses.
   * @param {any} data - The incoming message data.
   */
  protected abstract handleMessage(data: any): void;

  /**
   * Abstract method for subscribing to specific events on the WebSocket.
   * Must be implemented by subclasses.
   */
  protected abstract subscribe(): void;

  /**
   * Sets up WebSocket connection event handlers.
   */
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
