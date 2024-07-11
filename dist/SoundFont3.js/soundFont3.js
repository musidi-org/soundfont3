"use strict";var e=require("./types/generator.js");require("./types/modulator.js");var t=require("./chunk.js"),s=require("./riff/parseError.js"),r=require("./riff/parser.js");require("./chunks/parsers/generators.js");var a=require("./chunks/parsers/zones.js"),n=Object.defineProperty,o=(e,t,s)=>((e,t,s)=>t in e?n(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s)(e,"symbol"!=typeof t?t+"":t,s);const i=e=>{const t={};return(...s)=>{const r=JSON.stringify(s);if(r in t)return t[r];const a=e(...s);return t[r]=a,a}};class u{constructor(e){if(o(this,"chunk"),o(this,"metaData"),o(this,"sampleData"),o(this,"samples"),o(this,"presetData"),o(this,"instruments"),o(this,"presets"),o(this,"banks"),!(e instanceof t.SF2Chunk)){const s=r.parseBuffer(e);e=new t.SF2Chunk(s)}if(3!==e.subChunks.length)throw new s.ParseError("Invalid sfbk structure","3 chunks",`${e.subChunks.length} chunks`);this.chunk=e,this.metaData=e.subChunks[0].getMetaData(),this.sampleData=e.subChunks[1].getSampleData(),this.presetData=e.subChunks[2].getPresetData(),this.samples=this.getSamples(),this.instruments=this.getInstruments(),this.presets=this.getPresets(),this.banks=this.getBanks()}static from(e){return new u(e)}getKeyData(e,t=0,s=0){return i(((e,t,s)=>{const r=this.banks[t];if(r){const t=r.presets[s];if(t){const s=t.zones.find((t=>this.isKeyInRange(t,e)));if(s){const r=s.instrument,a=r.zones.find((t=>this.isKeyInRange(t,e)));if(a){const n=a.sample,o={...s.generators,...a.generators},i={...s.modulators,...a.modulators};return{keyNumber:e,preset:t,instrument:r,sample:n,generators:o,modulators:i}}}}}return null}))(e,t,s)}isKeyInRange(e,t){return void 0===e.keyRange||e.keyRange.lo<=t&&e.keyRange.hi>=t}getBanks(){return this.presets.reduce(((e,t)=>{const s=t.header.bank;return e[s]||(e[s]={presets:[]}),e[s].presets[t.header.preset]=t,e}),[])}getPresets(){const{presetHeaders:t,presetZones:s,presetGenerators:r,presetModulators:n}=this.presetData;return a.getItemsInZone(t,s,n,r,this.instruments,e.GeneratorType.Instrument).filter((e=>"EOP"!==e.header.name)).map((e=>({header:e.header,globalZone:e.globalZone,zones:e.zones.map((e=>({keyRange:e.keyRange,generators:e.generators,modulators:e.modulators,instrument:e.reference})))})))}getInstruments(){const{instrumentHeaders:t,instrumentZones:s,instrumentModulators:r,instrumentGenerators:n}=this.presetData;return a.getItemsInZone(t,s,r,n,this.samples,e.GeneratorType.SampleId).filter((e=>"EOI"!==e.header.name)).map((e=>({header:e.header,globalZone:e.globalZone,zones:e.zones.map((e=>({keyRange:e.keyRange,generators:e.generators,modulators:e.modulators,sample:e.reference})))})))}getSamples(){return this.presetData.sampleHeaders.filter((e=>"EOS"!==e.name)).map((e=>{if("EOS"!==e.name&&e.sampleRate<=0)throw new Error(`Illegal sample rate of ${e.sampleRate} hz in sample '${e.name}'`);e.originalPitch>=128&&e.originalPitch<=254&&(e.originalPitch=60),e.startLoop-=e.start,e.endLoop-=e.start;const t=Number(this.metaData.version);if(t>=3&&t<4){return{header:e,data:this.sampleData.subarray(e.start,e.end)}}return{header:e,data:new Int16Array(new Uint8Array(this.sampleData.subarray(2*e.start,2*e.end)).buffer)}}))}}exports.SoundFont3=u,exports.memoize=i;
//# sourceMappingURL=soundFont3.js.map
