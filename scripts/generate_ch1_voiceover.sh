#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
TTS_CLI="${TTS_CLI:-$CODEX_HOME_DIR/skills/speech/scripts/text_to_speech.py}"

INPUT_MANIFEST="$ROOT_DIR/assets/prompts/chapter-01/speech.jsonl"
OUTPUT_DIR="$ROOT_DIR/output/speech/ch1"
TMP_DIR="$ROOT_DIR/tmp/speech/ch1"

RUN_MODE="auto"

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--dry-run | --live]

Options:
  --dry-run   Print request payloads only.
  --live      Generate audio files via OpenAI TTS API.
  --help      Show this help text.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      RUN_MODE="dry-run"
      shift
      ;;
    --live)
      RUN_MODE="live"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ ! -f "$TTS_CLI" ]]; then
  echo "Missing TTS CLI: $TTS_CLI" >&2
  exit 1
fi

if [[ ! -f "$INPUT_MANIFEST" ]]; then
  echo "Missing speech manifest: $INPUT_MANIFEST" >&2
  exit 1
fi

if [[ "$RUN_MODE" == "auto" ]]; then
  if [[ -n "${OPENAI_API_KEY:-}" ]]; then
    RUN_MODE="live"
  else
    RUN_MODE="dry-run"
  fi
fi

if [[ "$RUN_MODE" == "live" ]]; then
  if [[ -z "${OPENAI_API_KEY:-}" ]]; then
    echo "OPENAI_API_KEY is not set. Use --dry-run or export OPENAI_API_KEY for live generation." >&2
    exit 1
  fi

  if ! python3 - <<'PY' >/dev/null 2>&1
import openai
PY
  then
    echo "python 'openai' package is missing. Install with: python3 -m pip install openai" >&2
    exit 1
  fi
fi

mkdir -p "$OUTPUT_DIR" "$TMP_DIR"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$TMP_DIR/run-$TIMESTAMP-$RUN_MODE.log"

CMD=(
  python3 "$TTS_CLI" speak-batch
  --input "$INPUT_MANIFEST"
  --out-dir "$OUTPUT_DIR"
  --rpm 30
  --attempts 3
)

if [[ "$RUN_MODE" == "dry-run" ]]; then
  CMD+=(--dry-run)
fi

echo "[chapter-1-voiceover] mode=$RUN_MODE"
echo "[chapter-1-voiceover] manifest: $INPUT_MANIFEST"
echo "[chapter-1-voiceover] output:   $OUTPUT_DIR"
"${CMD[@]}" | tee "$LOG_FILE"

echo "[chapter-1-voiceover] log: $LOG_FILE"

if [[ "$RUN_MODE" == "dry-run" ]]; then
  echo "[chapter-1-voiceover] dry-run complete. Set OPENAI_API_KEY and run --live to generate audio."
else
  echo "[chapter-1-voiceover] live generation complete."
fi
