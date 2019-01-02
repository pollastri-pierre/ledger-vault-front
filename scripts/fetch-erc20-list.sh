#!/bin/env bash

# ------
UPSTREAM=git@github.com:jchampemont/crypto-assets.git
BRANCH=first-import
OUTPUT_FILE=src/data/erc20-list.json
# ------

# exit on error
set -e

function main {

  TMP_DIR=$(mktemp -d)
  DIR_TO_SCAN=tokens/ethereum/erc20

  echo "-- cloning from $UPSTREAM"
  git clone "$UPSTREAM" "$TMP_DIR"

  # TODO: remove this once the token has been signed
  echo "-- changing branch"
  cd "$TMP_DIR"
  git checkout "$BRANCH"
  cd -

  echo "-- concatenating all json files of $DIR_TO_SCAN"
  FULL=$(
    while read -r f ; do echo -n "$(cat "$f"), " ; done \
      < <(find "$TMP_DIR/$DIR_TO_SCAN" -name '*.json')
  )

  echo "[${FULL::-2}]" \
    | ./node_modules/.bin/prettier --stdin --parser json \
    | tee "$OUTPUT_FILE"

  echo "-- saved into $OUTPUT_FILE"

}

function cleanup {
  [[ -n "$TMP_DIR" ]] && rm -rf "$TMP_DIR"
}

trap cleanup EXIT
main
