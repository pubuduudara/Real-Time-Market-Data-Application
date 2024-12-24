/**
 * Generic buffer manager for batching and flushing data.
 * Handles buffering records and periodically or conditionally flushing them using a callback.
 * @template T - The type of data to be buffered.
 */
import logger from "../utils/logger.utils";

export class BufferManager<T> {
  private buffer: T[] = []; // The buffer holding records
  private bufferLimit: number; // Maximum number of records in the buffer before automatic flush
  private flushInterval: number; //Interval (in milliseconds) for periodic buffer flushing
  private flushCallback: (data: T[]) => Promise<void>; //Callback function to flush the buffer to the target destination

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

  /**
   * Adds an item to the buffer.
   * Triggers an immediate flush if the buffer exceeds its limit.
   * @param {T} item - The item to add to the buffer.
   * @returns {Promise<void>}
   */
  public async addToBuffer(item: T): Promise<void> {
    this.buffer.push(item);

    if (this.buffer.length >= this.bufferLimit) {
      await this.flushBuffer();
    }
  }

  /**
   * Flushes the buffer, invoking the flush callback and clearing the buffer.
   * If flushing fails, the data is re-added to the buffer for retry.
   * @returns {Promise<void>}
   */
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

  /**
   * Starts a periodic flush of the buffer at the specified interval.
   */
  private startBufferFlush(): void {
    setInterval(async () => {
      await this.flushBuffer();
    }, this.flushInterval);
  }
}
