import {
  getGenerators,
  getInstrumentHeaders,
  getModulators,
  getPresetHeaders,
  getSampleHeaders,
  getZones,
} from './chunks'
import { type SF_INFO_CHUNKS_ID, SF_VERSION_LENGTH } from './constants'
import { ParseError, RIFFChunk } from './riff'
import type { MetaData, PresetData } from './types'

export class SF2Chunk extends RIFFChunk {
  /**
   * All sub-chunks of this `SF2Chunk` as `SF2Chunk`.
   */
  public override readonly subChunks: SF2Chunk[]

  public constructor(chunk: RIFFChunk) {
    super(chunk.id, chunk.length, chunk.buffer, chunk.subChunks)

    this.subChunks = chunk.subChunks.map((subChunk) => new SF2Chunk(subChunk))
  }

  /**
   * Get meta data from the chunk. This assumes the chunk is a LIST chunk, containing INFO
   * sub-chunks.
   */
  private validMetaDataChunkId(): boolean {
    return this.id === 'LIST'
  }

  public getMetaData(): MetaData {
    if (!this.validMetaDataChunkId()) {
      throw new ParseError('Unexpected chunk ID', `'LIST'`, `'${this.id}'`)
    }

    const info = this.subChunks.reduce<{ [key in SF_INFO_CHUNKS_ID]?: string }>(
      (target, chunk) => {
        if (chunk.id === 'ifil' || chunk.id === 'iver') {
          // ifil and iver length must be 4 bytes
          if (chunk.length !== SF_VERSION_LENGTH) {
            throw new ParseError(`Invalid size for the '${chunk.id}' sub-chunk`)
          }
          target[chunk.id as SF_INFO_CHUNKS_ID] =
            `${chunk.getInt16()}.${chunk.getInt16(2)}`
        } else {
          target[chunk.id as SF_INFO_CHUNKS_ID] = chunk.getString()
        }

        return target
      },
      {},
    )

    if (!info.ifil) {
      throw new ParseError(`Missing required 'ifil' sub-chunk`)
    }

    if (!info.INAM) {
      throw new ParseError(`Missing required 'INAM' sub-chunk`)
    }

    return {
      version: info.ifil,
      soundEngine: info.isng || 'EMU8000',
      name: info.INAM,
      rom: info.irom,
      romVersion: info.iver,
      creationDate: info.ICRD,
      author: info.IENG,
      product: info.IPRD,
      copyright: info.ICOP,
      comments: info.ICMT,
      createdBy: info.ISFT,
    }
  }

  /**
   * Get the sample data as a unsigned 8-bit buffer from the chunk. This assumes the chunk is a
   * LIST chunk containing a smpl sub-chunk.
   */
  public getSampleData(): Uint8Array {
    if (!this.validMetaDataChunkId()) {
      throw new ParseError('Unexpected chunk ID', `'LIST'`, `'${this.id}'`)
    }

    const sampleChunk = this.subChunks[0]
    if (sampleChunk.id !== 'smpl') {
      throw new ParseError(
        'Invalid chunk signature',
        `'smpl'`,
        `'${sampleChunk.id}'`,
      )
    }

    return new Uint8Array(sampleChunk.buffer)
  }

  /**
   * Get the preset data from the chunk. This assumes the chunk is a LIST chunk containing the
   * preset data sub-chunks.
   */
  public getPresetData(): PresetData {
    if (!this.validMetaDataChunkId()) {
      throw new ParseError('Unexpected chunk ID', `'LIST'`, `'${this.id}'`)
    }

    return {
      presetHeaders: getPresetHeaders(this.subChunks[0]),
      presetZones: getZones(this.subChunks[1], 'pbag'),
      presetModulators: getModulators(this.subChunks[2], 'pmod'),
      presetGenerators: getGenerators(this.subChunks[3], 'pgen'),
      instrumentHeaders: getInstrumentHeaders(this.subChunks[4]),
      instrumentZones: getZones(this.subChunks[5], 'ibag'),
      instrumentModulators: getModulators(this.subChunks[6], 'imod'),
      instrumentGenerators: getGenerators(this.subChunks[7], 'igen'),
      sampleHeaders: getSampleHeaders(this.subChunks[8]),
    }
  }
}
