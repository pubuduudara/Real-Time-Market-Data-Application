import logger from "../utils/logger.utils";

export class BufferManager<T> {
  private buffer: T[] = [];
  private bufferLimit: number;
  private flushInterval: number;
  private flushCallback: (data: T[]) => Promise<void>;

  constructor(
    bufferLimit: number,
    flushInterval: number,
    flushCallback: (data: T[]) => Promise<void>
  ) {
    this.bufferLimit = bufferLimit;
    this.flushInterval = flushInterval;
    this.flushCallback = flushCallback;
    this.startBufferFlush();
  }

  public async addToBuffer(item: T): Promise<void> {
    this.buffer.push(item);

    if (this.buffer.length >= this.bufferLimit) {
      await this.flushBuffer();
    }
  }

  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;

    const dataToFlush = [...this.buffer];
    this.buffer = []; // Clear the buffer before processing to handle incoming data

    try {
      await this.flushCallback(dataToFlush);
    } catch (error) {
      logger.error("Failed to flush buffer", error);
      this.buffer = [...dataToFlush, ...this.buffer]; // Restore unsaved data
    }
  }

  private startBufferFlush(): void {
    setInterval(async () => {
      await this.flushBuffer();
    }, this.flushInterval);
  }
}
