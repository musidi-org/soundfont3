"use strict";var e=require("../../riff/parseError.js"),r=require("../../constants.js"),t=require("../../types/generator.js");require("../../types/modulator.js");const n=(e,r,t)=>{const n=r[e],o=r[e+1],a=n.modulatorIndex,g=o?o.modulatorIndex:r.length;return s(a,g,t)},o=(e,r,t)=>{const n=r[e],o=r[e+1],a=n.generatorIndex,g=o?o.generatorIndex:r.length;return s(a,g,t)},s=(e,r,t)=>{const n={};for(let o=e;o<r;o++){const e=t[o];e&&(n[e.id]=e)}return n};exports.getItemsInZone=(e,r,s,a,g,u)=>{const d=[];for(let l=0;l<e.length;l++){const c=e[l],i=e[l+1],I=c.bagIndex,h=i?i.bagIndex:r.length,x=[];let f;for(let e=I;e<h;e++){const d=n(e,r,s),l=o(e,r,a),c=l[t.GeneratorType.KeyRange]&&l[t.GeneratorType.KeyRange].range,i=l[u];if(!i){e-I==0&&(f={keyRange:c,modulators:d,generators:l});continue}const h=g[i.value];h&&x.push({keyRange:c,modulators:d,generators:l,reference:h})}d.push({header:c,globalZone:f,zones:x})}return d},exports.getZones=(t,n)=>{if(t.id!==n)throw new e.ParseError("Unexpected chunk ID",`'${n}'`,`'${t.id}'`);if(t.length%r.SF_BAG_SIZE)throw new e.ParseError(`Invalid size for the '${n}' sub-chunk`);return t.iterate((e=>({generatorIndex:e.getInt16(),modulatorIndex:e.getInt16()})))};
//# sourceMappingURL=zones.js.map
