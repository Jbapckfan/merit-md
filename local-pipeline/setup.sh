#!/bin/bash
# ── MedMal Review Pro — Local Pipeline Setup ──
# Sets up the local processing environment on Mac Mini.

set -e

echo ""
echo "== MedMal Review Pro — Local Pipeline Setup =="
echo ""

# Create local directories
echo "[setup] Creating directories..."
mkdir -p ~/.merit-md/{cases,archive,config}
echo "  ~/.merit-md/cases/    — active case directories"
echo "  ~/.merit-md/archive/  — completed cases"
echo "  ~/.merit-md/config/   — pipeline configuration"
echo ""

# Check dependencies
echo "[setup] Checking dependencies..."

MISSING=0

if command -v claude &>/dev/null; then
  echo "  [OK] claude CLI found at $(which claude)"
else
  echo "  [ERROR] claude CLI not found — required for AI analysis"
  MISSING=1
fi

if command -v node &>/dev/null; then
  echo "  [OK] node $(node --version)"
else
  echo "  [ERROR] node not found"
  MISSING=1
fi

if command -v npx &>/dev/null; then
  echo "  [OK] npx found"
else
  echo "  [ERROR] npx not found"
  MISSING=1
fi

if npx tsx --version &>/dev/null 2>&1; then
  echo "  [OK] tsx available via npx"
else
  echo "  [WARN] tsx not available — installing globally..."
  npm install -g tsx
fi

if command -v tesseract &>/dev/null; then
  echo "  [OK] tesseract $(tesseract --version 2>&1 | head -1)"
else
  echo "  [WARN] tesseract not found — OCR for image files will be disabled"
  echo "         Install with: brew install tesseract"
fi

echo ""

# Install npm dependencies (from project root)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "[setup] Checking npm dependencies..."
cd "$PROJECT_DIR"

# Check if pdf-parse and pdfkit are installed
NEEDS_INSTALL=0
if [ ! -d "node_modules/pdf-parse" ]; then
  echo "  pdf-parse not found"
  NEEDS_INSTALL=1
fi
if [ ! -d "node_modules/pdfkit" ]; then
  echo "  pdfkit not found"
  NEEDS_INSTALL=1
fi

if [ $NEEDS_INSTALL -eq 1 ]; then
  echo "  Installing missing dependencies..."
  npm install pdf-parse pdfkit
else
  echo "  [OK] pdf-parse and pdfkit already installed"
fi

echo ""

if [ $MISSING -eq 1 ]; then
  echo "[WARN] Some required dependencies are missing. Fix the errors above before running the pipeline."
else
  echo "[OK] Local pipeline ready."
fi

echo ""
echo "Process cases with:"
echo "  npx tsx local-pipeline/process-case.ts ~/.merit-md/cases/MATTER-ID"
echo ""
echo "Create a new case with:"
echo "  npx tsx local-pipeline/intake-new-case.ts"
echo ""
