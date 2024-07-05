import { existsSync, mkdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { SampleHeader, SoundFont3, writeSoundFont } from '..'
import { pcm16BufferToWav } from './convert'

type ToSoundFont3Config =
  | {
      bitrate: 32 | 48 | 64 | 96 | 128 | 192 | 256
      sampleRate: 16000 | 22050 | 24000 | 32000 | 44100 | 48000
      oggCompressionAlgorithm: 'vorbis'
    }
  | {
      bitrate: 32 | 48 | 64 | 96 | 128 | 192 | 256
      sampleRate: 48000
      oggCompressionAlgorithm: 'opus'
    }

/**
 * Convert samples to SF3
 */
export const toSoundFont3 = (
  _soundFont: SoundFont3,
  config: ToSoundFont3Config = {
    bitrate: 32,
    sampleRate: 44100,
    oggCompressionAlgorithm: 'vorbis'
  },
  folderPath = `soundfont-${crypto.randomUUID()}`
) => {
  if (typeof document !== 'undefined') throw Error('WebCodecs not supported yet.')
  if (!existsSync(folderPath)) mkdirSync(folderPath)

  const soundFont = structuredClone(_soundFont)
  const soundFontVersion = Number(soundFont.metaData.version)

  let audioType = 'wav'
  let sampleToBuffer = (sampleRate: number, data: Int16Array) => pcm16BufferToWav(sampleRate, data)
  if (soundFontVersion >= 3 && soundFontVersion < 4) {
    audioType = 'ogg'
    sampleToBuffer = (_: number, data: Int16Array) => Buffer.from(data)
  }

  const sampleHeaders: SampleHeader[] = []
  let sampleBuffer = Buffer.from('')
  soundFont.samples.map((sample) => {
    const fileName = `${folderPath}/${sample.header.name}`
    const originalAudioBuffer = sampleToBuffer(sample.header.sampleRate, sample.data)
    writeFileSync(`${fileName}.${audioType}`, originalAudioBuffer)
    execSync(
      `ffmpeg -y -i "${fileName}.${audioType}" -ar ${config.sampleRate} -ab ${config.bitrate}k -acodec lib${config.oggCompressionAlgorithm} "${fileName}.ogg"`,
      {
        stdio: 'ignore'
      }
    )
    const oggBuffer = readFileSync(`${fileName}.ogg`)
    unlinkSync(`${fileName}.wav`)
    unlinkSync(`${fileName}.ogg`)

    const padBuffer = Buffer.from(new ArrayBuffer(2 - (oggBuffer.byteLength % 2)))
    sample.header.start = sampleBuffer.byteLength
    sample.header.end = sample.header.start + oggBuffer.byteLength
    sample.header.startLoop -= sample.header.start
    sample.header.endLoop -= sample.header.start
    sampleHeaders.push(sample.header)
    sampleBuffer = Buffer.concat([sampleBuffer, oggBuffer, padBuffer])
  })
  rmdirSync(folderPath)

  soundFont.metaData.version = '3.1'
  soundFont.sampleData = new Int16Array(sampleBuffer)
  soundFont.presetData.sampleHeaders = sampleHeaders
  return new SoundFont3(writeSoundFont(soundFont))
}