import{ParseError as t}from"../../riff/parseError.js";import{SF_MODULATOR_SIZE as e}from"../../constants.js";const r=t=>({type:t>>10&63,polarity:t>>9&1,direction:t>>8&1,palette:t>>7&1,index:127&t}),n=(n,o)=>{if(n.id!==o)throw new t("Unexpected chunk ID",`'${o}'`,`'${n.id}'`);if(n.length%e)throw new t(`Invalid size for the '${o}' sub-chunk`);return n.iterate((t=>({source:r(t.getInt16BE()),id:t.getInt16BE(),value:t.getInt16BE(),valueSource:r(t.getInt16BE()),transform:t.getInt16BE()})))};export{n as getModulators};
//# sourceMappingURL=modulators.js.map
