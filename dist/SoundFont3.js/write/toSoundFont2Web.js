"use strict";var e=require("../soundFont3.js"),t=require("./writeSoundFont.js"),n=require("./utils.js");function r(e){const t=new DataView(new ArrayBuffer(2*e.length));let n=0;for(let r=0;r<e.length;r++,n+=2){const a=Math.max(-1,Math.min(1,e[r]));t.setInt16(n,a<0?32768*a:32767*a,!0)}return t.buffer}exports.toSoundFont2Web=async a=>{const o=structuredClone(a);if(Number(o.metaData.version)<3)return a;const s=[];let d=new Int8Array,u=0;const i=await import("audio-decode");for(const e of o.samples){const t=r((await i.default(new Int8Array(e.data).buffer)).getChannelData(0)),a=new ArrayBuffer(2-t.byteLength%2);e.header.start=u,e.header.end=u+t.byteLength/2;const o=e.header.end-e.header.start,h=e.header.endLoop-e.header.startLoop;e.header.endLoop=o-128,e.header.startLoop=o-h-128,d=n.concatBuffer(n.concatBuffer(d,t),a),u+=t.byteLength/2+a.byteLength,s.push(e.header)}return console.info(`Sample size: ${(d.byteLength/10**6).toFixed(3)} mb`),o.metaData.version="2.04",o.sampleData=new Int16Array(d),o.presetData.sampleHeaders=s,new e.SoundFont3(new Uint8Array(t.writeSoundFont(o)))};
//# sourceMappingURL=toSoundFont2Web.js.map
