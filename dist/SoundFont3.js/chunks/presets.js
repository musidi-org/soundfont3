"use strict";var r=require("../riff/parseError.js"),e=require("../constants.js");exports.getPresetHeaders=t=>{if("phdr"!==t.id)throw new r.ParseError("Invalid chunk ID","'phdr'",`'${t.id}'`);if(t.length%e.SF_PRESET_HEADER_SIZE)throw new r.ParseError("Invalid size for the 'phdr' sub-chunk");return t.iterate((r=>({name:r.getString(),preset:r.getInt16(),bank:r.getInt16(),bagIndex:r.getInt16(),library:r.getUInt32(),genre:r.getUInt32(),morphology:r.getUInt32()})))};
//# sourceMappingURL=presets.js.map
