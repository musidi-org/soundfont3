"use strict";var t=require("./utils.js"),i=Object.defineProperty,s=(t,s,e)=>((t,s,e)=>s in t?i(t,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[s]=e)(t,"symbol"!=typeof s?s+"":s,e);exports.ChunkIterator=class{constructor(t,i=0){s(this,"target",[]),s(this,"chunk"),s(this,"position",0),this.chunk=t,this.position=i}get currentPosition(){return this.position}iterate(t){for(;this.position<this.chunk.length;){const i=t(this);i&&this.target.push(i)}}getString(i=20){const s=t.getStringFromBuffer(this.getBuffer(this.position,i));return this.position+=i,s}getInt16(){return this.chunk.buffer[this.position++]|this.chunk.buffer[this.position++]<<8}getInt16BE(){return this.getInt16()<<16>>16}getUInt32(){return(this.chunk.buffer[this.position++]|this.chunk.buffer[this.position++]<<8|this.chunk.buffer[this.position++]<<16|this.chunk.buffer[this.position++]<<24)>>>0}getByte(){return this.chunk.buffer[this.position++]}getChar(){return this.chunk.buffer[this.position++]<<24>>24}skip(t){this.position+=t}getBuffer(t,i){return this.chunk.buffer.subarray(t,t+i)}};
//# sourceMappingURL=chunkIterator.js.map
