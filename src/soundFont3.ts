import { SF2Chunk } from './chunk'
import { getItemsInZone } from './chunks'
import { ParseError, parseBuffer } from './riff'
import {
  type Bank,
  GeneratorType,
  type Instrument,
  type Key,
  type MetaData,
  type Preset,
  type PresetData,
  type Sample,
  type ZoneItems,
} from './types'

/**
 * Returns a memoized function for the original function. Function arguments are serialized as a
 * JSON string and stored in an in-memory object.
 *
 * @template T
 * @template U
 * @param {(...originalArgs: T[]) => U} originalFunction
 */
export const memoize = <T, U>(
  originalFunction: (...originalArgs: T[]) => U,
): ((...args: T[]) => U) => {
  const memo: { [key: string]: U } = {}

  return (...args: T[]) => {
    const serializedArgs = JSON.stringify(args)
    if (serializedArgs in memo) {
      return memo[serializedArgs]
    }

    const output = originalFunction(...args)
    memo[serializedArgs] = output
    return output
  }
}

/**
 * @alias constructor
 * Parses SoundFont file.
 * @param {Uint8Array | SF2Chunk} chunk - SoundFont binary file.
 * @returns {SoundFont3} Parsed SoundFont file.
 */
export class SoundFont3 {
  /**
   * Create a new `SoundFont3` instance from a raw input buffer.
   *
   * @param {Uint8Array} buffer
   * @deprecated Replaced with `new SoundFont3(buffer: Uint8Array);`
   */
  public static from(buffer: Uint8Array): SoundFont3 {
    return new SoundFont3(buffer)
  }

  /**
   * The raw RIFF chunk data.
   */
  public readonly chunk: SF2Chunk

  /**
   * The meta data.
   */
  public readonly metaData: MetaData

  /**
   * The raw sample data.
   */
  public readonly sampleData: Uint8Array

  /**
   * The parsed samples.
   */
  public readonly samples: Sample[]

  /**
   * The unparsed preset data.
   */
  public readonly presetData: PresetData

  /**
   * The parsed instuments.
   */
  public readonly instruments: Instrument[]

  /**
   * The parsed presets.
   */
  public readonly presets: Preset[]

  /**
   * The parsed banks.
   */
  public readonly banks: Bank[]

  /**
   * Load a SoundFont3 file from a `Uint8Array` or a `SF2Chunk`. The recommended way is to use a
   * Uint8Array, loading a SoundFont3 from a `SF2Chunk` only exists for backwards compatibility and
   * will likely be removed in a future version.
   *
   * @param {Uint8Array|SF2Chunk} chunk
   */
  public constructor(chunk: Uint8Array | SF2Chunk) {
    if (!(chunk instanceof SF2Chunk)) {
      const parsedBuffer = parseBuffer(chunk)
      chunk = new SF2Chunk(parsedBuffer)
    }

    if (chunk.subChunks.length !== 3) {
      throw new ParseError(
        'Invalid sfbk structure',
        '3 chunks',
        `${chunk.subChunks.length} chunks`,
      )
    }

    this.chunk = chunk
    this.metaData = chunk.subChunks[0].getMetaData()
    this.sampleData = chunk.subChunks[1].getSampleData()
    this.presetData = chunk.subChunks[2].getPresetData()

    this.samples = this.getSamples()
    this.instruments = this.getInstruments()
    this.presets = this.getPresets()
    this.banks = this.getBanks()
  }

  /**
   * Get the key data by MIDI bank, preset and key number. May return null if no instrument was
   * found for the given inputs. Note that this does not process any of the generators that are
   * specific to the key number.
   *
   * The result is memoized based on all arguments, to prevent having to check all presets,
   * instruments etc. every time.
   *
   * @param {number} memoizedKeyNumber - The MIDI key number
   * @param {number} [memoizedBankNumber] - The bank index number, defaults to 0
   * @param {number} [memoizedPresetNumber] - The preset number, defaults to 0
   */
  public getKeyData(
    memoizedKeyNumber: number,
    memoizedBankNumber = 0,
    memoizedPresetNumber = 0,
  ): Key | null {
    // Get a memoized version of the function
    return memoize(
      (
        keyNumber: number,
        bankNumber: number,
        presetNumber: number,
      ): Key | null => {
        const bank = this.banks[bankNumber]
        if (bank) {
          const preset = bank.presets[presetNumber]
          if (preset) {
            const presetZone = preset.zones.find((zone) =>
              this.isKeyInRange(zone, keyNumber),
            )
            if (presetZone) {
              const instrument = presetZone.instrument
              const instrumentZone = instrument.zones.find((zone) =>
                this.isKeyInRange(zone, keyNumber),
              )
              if (instrumentZone) {
                const sample = instrumentZone.sample
                const generators = {
                  ...presetZone.generators,
                  ...instrumentZone.generators,
                }
                const modulators = {
                  ...presetZone.modulators,
                  ...instrumentZone.modulators,
                }

                return {
                  keyNumber,
                  preset,
                  instrument,
                  sample,
                  generators,
                  modulators,
                }
              }
            }
          }
        }

        return null
      },
    )(memoizedKeyNumber, memoizedBankNumber, memoizedPresetNumber)
  }

  /**
   * Checks if a MIDI key number is in the range of a zone.
   *
   * @param {ZoneItems} zone - The zone to check
   * @param {number} keyNumber - The MIDI key number, must be between 0 and 127
   */
  private isKeyInRange(zone: ZoneItems, keyNumber: number): boolean {
    return (
      zone.keyRange === undefined ||
      (zone.keyRange.lo <= keyNumber && zone.keyRange.hi >= keyNumber)
    )
  }

  /**
   * Parse the presets to banks.
   */
  private getBanks(): Bank[] {
    return this.presets.reduce<Bank[]>((target, preset) => {
      const bankNumber = preset.header.bank

      if (!target[bankNumber]) {
        target[bankNumber] = {
          presets: [],
        }
      }

      target[bankNumber].presets[preset.header.preset] = preset
      return target
    }, [])
  }

  /**
   * Parse the raw preset data to presets.
   */
  private getPresets(): Preset[] {
    const { presetHeaders, presetZones, presetGenerators, presetModulators } =
      this.presetData

    const presets = getItemsInZone(
      presetHeaders,
      presetZones,
      presetModulators,
      presetGenerators,
      this.instruments,
      GeneratorType.Instrument,
    )

    return presets
      .filter((preset) => preset.header.name !== 'EOP')
      .map((preset) => {
        return {
          header: preset.header,
          globalZone: preset.globalZone,
          zones: preset.zones.map((zone) => {
            return {
              keyRange: zone.keyRange,
              generators: zone.generators,
              modulators: zone.modulators,
              instrument: zone.reference,
            }
          }),
        }
      })
  }

  /**
   * Parse the raw instrument data (found in the preset data) to instruments.
   */
  private getInstruments(): Instrument[] {
    const {
      instrumentHeaders,
      instrumentZones,
      instrumentModulators,
      instrumentGenerators,
    } = this.presetData

    const instruments = getItemsInZone(
      instrumentHeaders,
      instrumentZones,
      instrumentModulators,
      instrumentGenerators,
      this.samples,
      GeneratorType.SampleId,
    )

    return instruments
      .filter((instrument) => instrument.header.name !== 'EOI')
      .map((instrument) => {
        return {
          header: instrument.header,
          globalZone: instrument.globalZone,
          zones: instrument.zones.map((zone) => {
            return {
              keyRange: zone.keyRange,
              generators: zone.generators,
              modulators: zone.modulators,
              sample: zone.reference,
            }
          }),
        }
      })
  }

  /**
   * Parse the raw sample data and sample headers to samples.
   */
  private getSamples(): Sample[] {
    return this.presetData.sampleHeaders
      .filter((sample) => sample.name !== 'EOS')
      .map((header) => {
        // Sample rate must be above 0
        if (header.name !== 'EOS' && header.sampleRate <= 0) {
          throw new Error(
            `Illegal sample rate of ${header.sampleRate} hz in sample '${header.name}'`,
          )
        }

        // Original pitch cannot be between 128 and 254
        if (header.originalPitch >= 128 && header.originalPitch <= 254) {
          header.originalPitch = 60
        }

        header.startLoop -= header.start
        header.endLoop -= header.start

        const soundFontVersion = Number(this.metaData.version)
        if (soundFontVersion >= 3 && soundFontVersion < 4) {
          const data = this.sampleData.subarray(header.start, header.end)
          return {
            header,
            data,
          }
        }

        return {
          header,
          data: new Int16Array(
            new Uint8Array(
              this.sampleData.subarray(header.start * 2, header.end * 2),
            ).buffer,
          ),
        }
      })
  }
}
