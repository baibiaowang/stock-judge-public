import fs from 'node:fs';
import path from 'node:path';

const SRC='www', OUT='dist/www', ENTRY='index.html';
const DEFAULT_URLS=[
  'https://cdn.jsdelivr.net/gh/baibiaowang/stock-judge-app@main/data/stocks.txt',
  'https://raw.githubusercontent.com/baibiaowang/stock-judge-app/main/data/stocks.txt'
].join('\n');
const urls=(process.env.DATA_URL||'').trim()||DEFAULT_URLS;
if(!fs.existsSync(path.join(SRC,ENTRY)))process.exit(1);
fs.rmSync(OUT,{recursive:true,force:true});fs.cpSync(SRC,OUT,{recursive:true});
const P=path.join(OUT,ENTRY);
let h=fs.readFileSync(P,'utf8');
function jsSingleQuote(s){return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
h=h.split('__DATA_URL__').join(jsSingleQuote(urls));
if(h.includes('__DATA_URL__')){console.error('placeholder remains');process.exit(1);}
const blocks=[...h.matchAll(/<script\\b[^>]*>([\\s\\S]*?)<\\/script>/gi)].map(m=>m[1]);
for(const b of blocks){try{new Function(b);}catch(e){console.error('JS parse failed: '+e.message);process.exit(1);}}
fs.writeFileSync(P,h);
console.log('[inject] ok urls='+urls.split('\n').length+' scripts='+blocks.length);
