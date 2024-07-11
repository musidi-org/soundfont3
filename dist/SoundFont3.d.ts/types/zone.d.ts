import { Modulator } from './modulator.js'
import { Generator, GeneratorType, Range } from './generator.js'

/**
 * Describes the generator and modulator index for a preset or instrument zone, defined to play
 * over certain key numbers and velocities.
 *
 * If a preset or instrument has more than one zone, the first zone may be a global zone. A global
 * zone is determined by the fact that the last generator in the list is not an instrument
 * generator.
 */
interface Zone {
  /**
   * The index of the preset's or instrument's list of generators in the PGEN or IGEN sub-chunk.
   */
  generatorIndex: number
  /**
   * The index of the preset's or instrument's list of modulators in the PMOD or IMOD sub-chunk.
   */
  modulatorIndex: number
}
type ZoneMap<T extends Modulator | Generator> = {
  [key in GeneratorType]?: T
}
interface ZoneItems {
  /**
   * The key range for the zone.
   */
  keyRange?: Range
  /**
   * The modulators in the zone.
   */
  modulators: ZoneMap<Modulator>
  /**
   * The generators in the zone.
   */
  generators: ZoneMap<Generator>
}

export type { Zone, ZoneItems, ZoneMap }