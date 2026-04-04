#!/bin/bash
# ── MedMal Review — Voice Hotline Setup ──
# Sets up the voice intake hotline on Mac Mini.

set -e

echo ""
echo "== MedMal Review — Voice Hotline Setup =="
echo ""

# ── Check dependencies ──

echo "[setup] Checking dependencies..."
MISSING=0

if command -v node &>/dev/null; then
  echo "  [OK] node $(node --version)"
else
  echo "  [ERROR] node not found"
  MISSING=1
fi

if command -v whisper &>/dev/null; then
  echo "  [OK] whisper found at $(which whisper)"
else
  echo "  [WARN] whisper not found — install with: pip install openai-whisper"
  echo "         Voice transcription will fail without it."
fi

# Check Voicebox TTS
if curl -s http://localhost:17493/health >/dev/null 2>&1; then
  echo "  [OK] Voicebox TTS server reachable at localhost:17493"
else
  echo "  [WARN] Voicebox TTS not reachable at localhost:17493"
  echo "         Hotline will fall back to Twilio's built-in TTS."
fi

echo ""

# ── Environment variables ──

echo "[setup] Environment variables needed:"
echo ""
echo "  Required for live calls:"
echo "    TWILIO_ACCOUNT_SID=your_account_sid"
echo "    TWILIO_AUTH_TOKEN=your_auth_token"
echo "    TWILIO_PHONE_NUMBER=+1XXXXXXXXXX"
echo "    HOTLINE_BASE_URL=https://your-domain-or-tailscale-ip:17500"
echo ""
echo "  Optional:"
echo "    HOTLINE_PORT=17500           (default: 17500)"
echo "    VOICEBOX_URL=http://localhost:17493  (default)"
echo ""

# ── Twilio setup instructions ──

echo "[setup] Twilio setup steps:"
echo ""
echo "  1. Sign up at twilio.com (free trial gives you a phone number)"
echo "  2. Get a phone number with voice + SMS capability"
echo "  3. Set the environment variables listed above"
echo "  4. Configure the Twilio phone number's voice webhook:"
echo "       URL: \$HOTLINE_BASE_URL/voice/incoming"
echo "       Method: HTTP POST"
echo "  5. Expose port 17500 to the internet (options):"
echo "       a. Tailscale Funnel: tailscale funnel 17500"
echo "       b. ngrok: ngrok http 17500"
echo "       c. Reverse proxy on your VPS"
echo "  6. Run: npx tsx local-pipeline/voice-hotline.ts"
echo ""

# ── Create directories ──

echo "[setup] Creating directories..."
mkdir -p ~/.merit-md/hotline-audio
echo "  ~/.merit-md/hotline-audio/ — temporary TTS and recording files"
echo ""

# ── Test run ──

if [ $MISSING -eq 0 ]; then
  echo "[OK] Dependencies look good."
  echo ""
  echo "Start the hotline with:"
  echo "  npx tsx local-pipeline/voice-hotline.ts"
  echo ""
  echo "Test without Twilio (stub mode):"
  echo "  curl -X POST http://localhost:17500/voice/incoming -d 'CallSid=test123&From=+15551234567'"
  echo ""
else
  echo "[WARN] Fix the errors above before starting the hotline."
fi

echo ""
