import { ChunkIterator } from './chunkIterator.js'

declare class RIFFChunk {
  /**
   * The chunk ID (fourCC).
   */
  readonly id: string
  /**
   * The length of the chunk.
   */
  readonly length: number
  /**
   * The raw buffer of the chunk.
   */
  readonly buffer: Uint8Array
  /**
   * The sub-chunks of the chunk. If the chunk is not a RIFF or LIST chunk, this will be an empty
   * array.
   */
  readonly subChunks: RIFFChunk[]
  constructor(id: string, length: number, buffer: Uint8Array, subChunks: RIFFChunk[])
  /**
   * Get a string from the buffer. If no position and no length is specified, it returns the whole
   * buffer as a string.
   *
   * @param {number} [position]
   * @param {number} [length]
   */
  getString(position?: number, length?: number): string
  /**
   * Get a signed 16-bit integer from the buffer.
   *
   * @param {number} [position]
   */
  getInt16(position?: number): number
  /**
   * Get an unsigned 32-bit integer from the buffer.
   *
   * @param {number} [position]
   */
  getUInt32(position?: number): number
  /**
   * Get a byte from the buffer.
   *
   * @param {number} [position]
   */
  getByte(position?: number): number
  /**
   * Get a char from the buffer.
   *
   * @param {number} [position]
   */
  getChar(position?: number): number
  /**
   * Get a chunk iterator for the chunk.
   *
   * @param {number} [start] - The position where to start iterating. Defaults to 0.
   */
  iterator<T>(start?: number): ChunkIterator<T>
  /**
   * Utility function to quickly iterate over a function.
   *
   * @template T
   * @param {(iterator: ChunkIterator): T} callback - The callback that returns an instance of the
   *   specified return type
   * @param {number} [start] - The optional index where to start iterating over the chunk
   */
  iterate<T>(callback: (iterator: ChunkIterator<T>) => T | null, start?: number): T[]
  /**
   * Get a buffer from `start` to `start` + `length`. The buffer is not copied (e.g. when using
   * .slice()), so any modifications to the buffer are done to the original buffer too.
   *
   * @param {number} start
   * @param {number} length
   */
  private getBuffer
}

export { RIFFChunk }
