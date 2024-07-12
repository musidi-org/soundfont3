import { RIFFChunk } from './riffChunk.js'

/**
 * A utility class to quickly iterate over a buffer.
 */
declare class ChunkIterator<T> {
  readonly target: T[]
  private readonly chunk
  private position
  constructor(chunk: RIFFChunk, start?: number)
  /**
   * Get the position from the iterator.
   */
  get currentPosition(): number
  /**
   * Iterate over the chunk.
   *
   * @param {Function} callback - The callback that is called every iteration
   */
  iterate(callback: (iterator: ChunkIterator<T>) => T | null): void
  /**
   * Get a string from the buffer.
   *
   * @param {number} length - The length of the string. If no length is specified, a default of 20
   *   is assumed
   */
  getString(length?: number): string
  /**
   * Get a signed 16-bit integer from the chunk.
   */
  getInt16(): number
  /**
   * Get a signed 16-bit integer from the chunk in the big-endian format.
   */
  getInt16BE(): number
  /**
   * Get an unsigned 32-bit integer from the chunk.
   */
  getUInt32(): number
  /**
   * Get a single byte from the chunk.
   */
  getByte(): number
  /**
   * Get a signed char from the chunk.
   */
  getChar(): number
  /**
   * Skip ahead in the buffer.
   *
   * @param {number} length
   */
  skip(length: number): void
  /**
   * Get a part of the buffer from start to start + length.
   *
   * @param {number} start
   * @param {number} length
   */
  private getBuffer
}

export { ChunkIterator }