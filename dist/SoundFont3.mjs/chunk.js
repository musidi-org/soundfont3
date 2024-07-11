import{ParseError as s}from"./riff/parseError.js";import{RIFFChunk as e}from"./riff/riffChunk.js";import{SF_VERSION_LENGTH as t}from"./constants.js";import{getInstrumentHeaders as r}from"./chunks/instruments.js";import{getPresetHeaders as n}from"./chunks/presets.js";import{getSampleHeaders as i}from"./chunks/samples.js";import{getGenerators as u}from"./chunks/parsers/generators.js";import{getModulators as h}from"./chunks/parsers/modulators.js";import{getZones as o}from"./chunks/parsers/zones.js";var a=Object.defineProperty,d=(s,e,t)=>((s,e,t)=>e in s?a(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t)(s,e+"",t);class m extends e{constructor(s){super(s.id,s.length,s.buffer,s.subChunks),d(this,"subChunks"),this.subChunks=s.subChunks.map((s=>new m(s)))}validMetaDataChunkId(){return"LIST"===this.id}getMetaData(){if(!this.validMetaDataChunkId())throw new s("Unexpected chunk ID","'LIST'",`'${this.id}'`);const e=this.subChunks.reduce(((e,r)=>{if("ifil"===r.id||"iver"===r.id){if(r.length!==t)throw new s(`Invalid size for the '${r.id}' sub-chunk`);e[r.id]=`${r.getInt16()}.${r.getInt16(2)}`}else e[r.id]=r.getString();return e}),{});if(!e.ifil)throw new s("Missing required 'ifil' sub-chunk");if(!e.INAM)throw new s("Missing required 'INAM' sub-chunk");return{version:e.ifil,soundEngine:e.isng||"EMU8000",name:e.INAM,rom:e.irom,romVersion:e.iver,creationDate:e.ICRD,author:e.IENG,product:e.IPRD,copyright:e.ICOP,comments:e.ICMT,createdBy:e.ISFT}}getSampleData(){if(!this.validMetaDataChunkId())throw new s("Unexpected chunk ID","'LIST'",`'${this.id}'`);const e=this.subChunks[0];if("smpl"!==e.id)throw new s("Invalid chunk signature","'smpl'",`'${e.id}'`);return new Uint8Array(e.buffer)}getPresetData(){if(!this.validMetaDataChunkId())throw new s("Unexpected chunk ID","'LIST'",`'${this.id}'`);return{presetHeaders:n(this.subChunks[0]),presetZones:o(this.subChunks[1],"pbag"),presetModulators:h(this.subChunks[2],"pmod"),presetGenerators:u(this.subChunks[3],"pgen"),instrumentHeaders:r(this.subChunks[4]),instrumentZones:o(this.subChunks[5],"ibag"),instrumentModulators:h(this.subChunks[6],"imod"),instrumentGenerators:u(this.subChunks[7],"igen"),sampleHeaders:i(this.subChunks[8])}}}export{m as SF2Chunk};
//# sourceMappingURL=chunk.js.map
