import{ParseError as t}from"../riff/parseError.js";import{SF_INSTRUMENT_HEADER_SIZE as n}from"../constants.js";const e=e=>{if("inst"!==e.id)throw new t("Unexpected chunk ID","'inst'",`'${e.id}'`);if(e.length%n)throw new t("Invalid size for the 'inst' sub-chunk");return e.iterate((t=>({name:t.getString(),bagIndex:t.getInt16()})))};export{e as getInstrumentHeaders};
//# sourceMappingURL=instruments.js.map
