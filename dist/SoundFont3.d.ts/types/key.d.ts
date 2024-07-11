import { Preset } from './preset.js'
import { Instrument } from './instrument.js'
import { Sample } from './sample.js'
import { ZoneMap } from './zone.js'
import { Generator } from './generator.js'
import { Modulator } from './modulator.js'

/**
 * Key data specific to a MIDI key.
 */
interface Key {
  /**
   * The MIDI key number. Must be a number between 0 and 127.
   */
  keyNumber: number
  /**
   * The preset for this MIDI key.
   */
  preset: Preset
  /**
   * The instrument for this MIDI key.
   */
  instrument: Instrument
  /**
   * The sample for this MIDI key.
   */
  sample: Sample
  /**
   * The generators for this MIDI key. Note that these are the preset generators merged with the
   * instrument generators.
   */
  generators: ZoneMap<Generator>
  /**
   * The modulators for this MIDI key. Note that these are the preset modulators merged with the
   * instrument modulators.
   */
  modulators: ZoneMap<Modulator>
}

export type { Key }
