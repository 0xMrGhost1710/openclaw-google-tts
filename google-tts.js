#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const args = process.argv.slice(2);
const config = { text: '', lang: 'es', output: `/tmp/tts_${Date.now()}.mp3`, speed: 1, pitch: 1 };
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--text') config.text = args[++i];
  else if (args[i] === '--lang') config.lang = args[++i];
  else if (args[i] === '--output') config.output = args[++i];
}
if (!config.text) { console.error('Error: --text required'); process.exit(1); }
const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(config.text)}&tl=${config.lang}`;
https.get(url, (res) => {
  res.pipe(fs.createWriteStream(config.output));
  res.on('end', () => console.log(`✅ ${config.output}`));
});
