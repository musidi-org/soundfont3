import{_ as e,c as r,o as t,a3 as a}from"./chunks/framework.Bwxt4t8n.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"SoundFont3","tagline":"Parser for Node.js and Web","actions":[{"theme":"brand","text":"Get Started","link":"/routes/1.%20Guide/README.html"}]},"features":[{"title":"Reduce bandwidth","details":"Over 10x lossy compression from SF2 to SF3."},{"title":"Composable","details":"Unix philosophy - focus only on parsing SF3"}]},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":1718889994000}'),o={name:"index.md"},s=a('<p> </p><h2 id="purpose" tabindex="-1">Purpose <a class="header-anchor" href="#purpose" aria-label="Permalink to &quot;Purpose&quot;">​</a></h2><div class="warning custom-block"><p class="custom-block-title">Problem</p><p>Large SoundFont2 files use bandwidth and loads slowly, especially quality ones like <a href="https://musical-artifacts.com/artifacts/483" target="_blank" rel="noreferrer">salamander.sf2</a></p></div><div class="tip custom-block"><p class="custom-block-title">Solution</p><p><a href="https://github.com/musescore/sftools" target="_blank" rel="noreferrer">SoundFont3</a>, by <a href="https://musescore.org/en" target="_blank" rel="noreferrer">MuseScore</a>, can achieve over 10x compression with <a href="https://xiph.org/vorbis/" target="_blank" rel="noreferrer">OGG VORBIS</a>.</p><p>Now you can reduce egress costs and improve user experience with speedy SoundFont download speeds.</p><p>If only we had JavaScript/TypeSscript SoundFont3 parser...</p></div><h2 id="disclaimer" tabindex="-1">Disclaimer <a class="header-anchor" href="#disclaimer" aria-label="Permalink to &quot;Disclaimer&quot;">​</a></h2><p>The original parser, created by <a href="https://github.com/Mrtenz" target="_blank" rel="noreferrer">Mrtenz</a>, adheres to the <a href="http://www.synthfont.com/SFSPEC21.PDF" target="_blank" rel="noreferrer">SoundFont 2.01</a> specification, with the goal of achieving compliance with <a href="http://www.synthfont.com/sfspec24.pdf" target="_blank" rel="noreferrer">SoundFont 2.04</a>. This <a href="https://github.com/musidi-org/soundfont3" target="_blank" rel="noreferrer">fork</a> is focused on a different goal - parsing SoundFont3.</p><p>This library is not production ready, hence the version 0.x.x. Some SoundFonts may be parsed incorrectly and the API may have breaking changes in the future. The first production release 1.0.0 and beyond will follow semantic versioning.</p>',7),n=[s];function i(l,c,d,p,h,u){return t(),r("div",null,n)}const _=e(o,[["render",i]]);export{m as __pageData,_ as default};
