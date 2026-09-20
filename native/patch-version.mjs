import fs from 'node:fs';
const p='android/app/build.gradle';
if(!fs.existsSync(p)){console.error('missing '+p);process.exit(1);}
let s=fs.readFileSync(p,'utf8');
s=s.replace(/versionCode\s+\d+/, 'versionCode 12');
s=s.replace(/versionName\s+"[^"]+"/, 'versionName "1.2.0"');
fs.writeFileSync(p,s);
console.log('[version] 1.2.0');
