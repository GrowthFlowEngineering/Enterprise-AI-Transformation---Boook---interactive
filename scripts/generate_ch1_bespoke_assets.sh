#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
IMAGE_CLI="${IMAGE_CLI:-$CODEX_HOME_DIR/skills/imagegen/scripts/image_gen.py}"
SORA_CLI="${SORA_CLI:-$CODEX_HOME_DIR/skills/sora/scripts/sora.py}"

IMAGE_INPUT="$ROOT_DIR/assets/prompts/chapter-01/imagegen.jsonl"
SORA_INPUT="$ROOT_DIR/assets/prompts/chapter-01/sora.jsonl"

IMAGE_OUT_DIR="$ROOT_DIR/output/imagegen/ch1"
SORA_OUT_DIR="$ROOT_DIR/output/sora/ch1"
IMAGE_TMP_DIR="$ROOT_DIR/tmp/imagegen/ch1"
SORA_TMP_DIR="$ROOT_DIR/tmp/sora/ch1"

RUN_MODE="auto"
WITH_SORA=0

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--dry-run | --live] [--with-sora]

Options:
  --dry-run     Generate request previews only. No API calls.
  --live        Run live API generation. Requires OPENAI_API_KEY and python 'openai' package.
  --with-sora   Also run chapter 1 short-video batch via Sora.
  --help        Show this help message.
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
    --with-sora)
      WITH_SORA=1
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

if [[ ! -f "$IMAGE_CLI" ]]; then
  echo "Missing image CLI: $IMAGE_CLI" >&2
  exit 1
fi

if [[ $WITH_SORA -eq 1 && ! -f "$SORA_CLI" ]]; then
  echo "Missing Sora CLI: $SORA_CLI" >&2
  exit 1
fi

if [[ ! -f "$IMAGE_INPUT" ]]; then
  echo "Missing image prompt manifest: $IMAGE_INPUT" >&2
  exit 1
fi

if [[ $WITH_SORA -eq 1 && ! -f "$SORA_INPUT" ]]; then
  echo "Missing Sora prompt manifest: $SORA_INPUT" >&2
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

mkdir -p "$IMAGE_OUT_DIR" "$SORA_OUT_DIR" "$IMAGE_TMP_DIR" "$SORA_TMP_DIR"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
IMAGE_LOG="$IMAGE_TMP_DIR/run-$TIMESTAMP-$RUN_MODE.log"
SORA_LOG="$SORA_TMP_DIR/run-$TIMESTAMP-$RUN_MODE.log"

IMAGE_CMD=(
  python3 "$IMAGE_CLI" generate-batch
  --input "$IMAGE_INPUT"
  --out-dir "$IMAGE_OUT_DIR"
  --concurrency 3
  --max-attempts 3
)

if [[ "$RUN_MODE" == "dry-run" ]]; then
  IMAGE_CMD+=(--dry-run)
fi

echo "[chapter-1-assets] mode=$RUN_MODE image_batch=true sora_batch=$WITH_SORA"
echo "[chapter-1-assets] image manifest: $IMAGE_INPUT"
echo "[chapter-1-assets] image output:   $IMAGE_OUT_DIR"
"${IMAGE_CMD[@]}" | tee "$IMAGE_LOG"

echo "[chapter-1-assets] image run log: $IMAGE_LOG"

if [[ $WITH_SORA -eq 1 ]]; then
  SORA_CMD=(
    python3 "$SORA_CLI" create-batch
    --input "$SORA_INPUT"
    --out-dir "$SORA_OUT_DIR"
    --concurrency 2
    --max-attempts 3
  )

  if [[ "$RUN_MODE" == "dry-run" ]]; then
    SORA_CMD+=(--dry-run)
  fi

  echo "[chapter-1-assets] sora manifest:  $SORA_INPUT"
  echo "[chapter-1-assets] sora output:    $SORA_OUT_DIR"
  "${SORA_CMD[@]}" | tee "$SORA_LOG"
  echo "[chapter-1-assets] sora run log: $SORA_LOG"
fi

if [[ "$RUN_MODE" == "dry-run" ]]; then
  echo "[chapter-1-assets] dry-run complete. Set OPENAI_API_KEY and use --live for real generation."
else
  echo "[chapter-1-assets] live generation complete."
fi
