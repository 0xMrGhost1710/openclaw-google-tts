# 🎤 Google TTS Skill for OpenClaw

> Texto a voz 100% gratis para OpenClaw usando Google Translate

## ✨ Características

- ✅ **100% Gratis** - Sin API keys necesarias
- 🌍 **Multiidioma** - Soporta más de 10 idiomas
- ⚡ **MP3 y WAV** - Salida en múltiples formatos
- 💾 **Caching** - Textos repetidos instantáneos
- 🔄 **Retry automático** - Hasta 2 reintentos si falla

## 🚀 Uso

```bash
# MP3 (por defecto)
gtts "Hola mundo" --lang es

# WAV (requiere ffmpeg)
gtts "Hello world" --lang en --format wav

# Sin cache
gtts "Test" --lang en --no-cache
```

### Parámetros

| Parámetro | Descripción | Valor por defecto |
|-----------|-------------|-------------------|
| `--text` | Texto a convertir | Requerido |
| `--lang` | Código de idioma | `es` |
| `--format` | Formato (`mp3`, `wav`) | `mp3` |
| `--output` | Ruta del archivo | Auto-generado |
| `--no-cache` | Desactivar cache | `false` |

## 🗣️ Idiomas Soportados

| Código | Idioma |
|--------|--------|
| `es` | Español |
| `en` | English |
| `fr` | Français |
| `de` | Deutsch |
| `it` | Italiano |
| `pt` | Português |
| `ru` | Русский |
| `ja` | 日本語 |
| `ko` | 한국어 |
| `zh-CN` | 中文 |

## 📁 Estructura

```
google-tts/
├── README.md
├── google-tts.js      # Script principal
└── samples/            # Audios de prueba
```

## 🎧 Samples

| Idioma | Audio |
|--------|-------|
| 🇪🇸 Español | `sample_es.mp3` |
| 🇺🇸 English | `sample_en.mp3` |
| 🇫🇷 Français | `sample_fr.mp3` |
| 🇩🇪 Deutsch | `sample_de.mp3` |
| 🇮🇹 Italiano | `sample_it.mp3` |
| 🇧🇷 Português | `sample_pt.mp3` |

## 🔧 Instalación

```bash
# Clonar
git clone https://github.com/0xMrGhost1710/openclaw-google-tts.git

# Instalar vía ClawHub (pronto)
clawhub install google-tts
```

### Requisitos

- **Node.js** 14+
- **ffmpeg** (opcional, para WAV)

```bash
sudo apt install ffmpeg    # Linux
brew install ffmpeg        # macOS
```

## 📦 Integración con OpenClaw

```bash
/gtts "Tu mensaje" --lang es
/gtts "Your message" --lang en --format wav
```

## 🛡️ Especificaciones

| Aspecto | Detalle |
|---------|---------|
| Calidad MP3 | 24kHz, mono |
| Calidad WAV | 24kHz, mono, PCM 16-bit |
| Cache | `/tmp/openclaw-tts-cache/` |
| Timeout | 10 segundos |
| Reintentos | 2 máximo |

## 📝 Licencia

MIT License - Built with ❤️ by OpenClaw AI Assistant & 0xMrGhost1710

---

**Issues:** https://github.com/0xMrGhost1710/openclaw-google-tts/issues
