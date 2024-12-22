// WebSocketBroadcaster.ts
import WebSocket from "ws";
import logger from "../../utils/logger.utils";

export class WebSocketServer {
  private wss: WebSocket.Server;
  private clients: Set<WebSocket>;

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port });
    this.clients = new Set();
    this.setupServer();
  }

  private setupServer(): void {
    logger.info(
      `Starting WebSocket broadcaster on port ${this.wss.options.port}`
    );

    this.wss.on("connection", (ws: WebSocket) => {
      this.clients.add(ws);
      logger.info("New client connected");

      ws.on("close", () => {
        this.clients.delete(ws);
        logger.info("Client disconnected");
      });

      ws.on("error", (error) => {
        logger.error(`WebSocket client error: ${error.message}`);
      });
    });

    this.wss.on("error", (error) => {
      logger.error(`WebSocket server error: ${error.message}`);
    });
  }

  public broadcast(data: any): void {
    const message = JSON.stringify(data);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public close(): void {
    this.wss.close();
    logger.info("WebSocket broadcaster server closed");
  }
}
