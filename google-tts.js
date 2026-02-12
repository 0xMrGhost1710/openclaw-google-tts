#!/usr/bin/env node
/**
 * Google TTS Skill for OpenClaw
 * Free text-to-speech using Google Translate
 * Supports MP3 and WAV output
 */

const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Configuration
const CACHE_DIR = '/tmp/openclaw-tts-cache';
const MAX_RETRIES = 2;
const TIMEOUT_MS = 10000;

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Parse arguments
const args = process.argv.slice(2);
const config = {
  text: '',
  lang: 'es',
  format: 'mp3',
  output: null,
  cache: true
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--text') config.text = args[++i];
  else if (args[i] === '--lang') config.lang = args[++i];
  else if (args[i] === '--format' || args[i] === '-f') config.format = args[++i];
  else if (args[i] === '--output') config.output = args[++i];
  else if (args[i] === '--no-cache') config.cache = false;
}

// Validate
if (!config.text) {
  console.error('❌ Error: --text is required');
  console.error('Usage: google-tts.js --text "Hola" --lang es [--format mp3|wav] [--no-cache]');
  process.exit(1);
}

// Generate cache key
function getCacheKey(text, lang, format) {
  const hash = crypto.createHash('md5').update(`${text}|${lang}|${format}`).digest('hex');
  return `${CACHE_DIR}/${hash}.${format}`;
}

// Supported languages
const languages = {
  'es': 'Spanish', 'en': 'English', 'fr': 'French',
  'de': 'German', 'it': 'Italian', 'pt': 'Portuguese',
  'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
  'zh-CN': 'Chinese'
};

// Download function with retry
function downloadWithRetry(url, outputPath, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    function tryDownload() {
      attempt++;
      console.log(`  📥 Attempt ${attempt}/${retries + 1}...`);
      
      const file = fs.createWriteStream(outputPath);
      let downloaded = false;

      const req = https.get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(outputPath, () => {});
          if (attempt <= retries) {
            setTimeout(tryDownload, 1000 * attempt);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
          return;
        }

        res.pipe(file);
        res.on('end', () => {
          downloaded = true;
          resolve(outputPath);
        });
      });

      req.setTimeout(TIMEOUT_MS, () => {
        req.destroy();
        file.close();
        fs.unlink(outputPath, () => {});
        if (attempt <= retries) {
          setTimeout(tryDownload, 1000 * attempt);
        } else {
          reject(new Error('Download timeout'));
        }
      });

      req.on('error', (err) => {
        file.close();
        fs.unlink(outputPath, () => {});
        if (attempt <= retries) {
          setTimeout(tryDownload, 1000 * attempt);
        } else {
          reject(err);
        }
      });
    }

    tryDownload();
  });
}

// Main
async function main() {
  console.log(`🎤 TTS: "${config.text.substring(0, 50)}${config.text.length > 50 ? '...' : ''}"`);
  console.log(`🌍 Lang: ${config.lang} (${languages[config.lang] || 'Unknown'})`);
  console.log(`📁 Format: ${config.format.toUpperCase()}`);

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(config.text)}&tl=${config.lang}`;

  try {
    // Check cache first
    if (config.cache) {
      const cacheKey = getCacheKey(config.text, config.lang, 'mp3');
      if (fs.existsSync(cacheKey)) {
        console.log(`  💾 Cache hit!`);
        
        if (config.format === 'wav') {
          const wavPath = config.output || cacheKey.replace('.mp3', '.wav');
          execSync(`ffmpeg -y -i "${cacheKey}" -ar 24000 -ac 1 "${wavPath}" 2>/dev/null`, { stdio: 'pipe' });
          fs.unlinkSync(cacheKey); // Cleanup cache
          console.log(`✅ ${wavPath}`);
        } else {
          fs.copyFileSync(cacheKey, config.output || `/tmp/tts_${Date.now()}.mp3`);
          console.log(`✅ ${config.output || cacheKey}`);
        }
        return;
      }
    }

    // Download MP3 to temp location
    const tempPath = `/tmp/tts_${Date.now()}.mp3`;
    await downloadWithRetry(url, tempPath);

    // Save to cache
    if (config.cache) {
      const cacheKey = getCacheKey(config.text, config.lang, 'mp3');
      fs.copyFileSync(tempPath, cacheKey);
      console.log(`  💾 Cached!`);
    }

    // Convert to WAV if requested
    if (config.format === 'wav') {
      const wavPath = config.output || tempPath.replace('.mp3', '.wav');
      execSync(`ffmpeg -y -i "${tempPath}" -ar 24000 -ac 1 "${wavPath}" 2>/dev/null`, { stdio: 'pipe' });
      fs.unlinkSync(tempPath);
      console.log(`✅ ${wavPath}`);
    } else {
      const finalPath = config.output || tempPath;
      if (config.output) {
        fs.copyFileSync(tempPath, finalPath);
        fs.unlinkSync(tempPath);
      }
      console.log(`✅ ${finalPath}`);
    }

  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
