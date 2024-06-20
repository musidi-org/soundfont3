import { TextDecoder } from 'util'
import { AudioContext } from 'node-web-audio-api'
// @ts-expect-error TextDecoder not included directly in Node.js
global.TextDecoder = TextDecoder
// @ts-expect-error AudioContext not included directly in Node.js
global.AudioContext = AudioContext