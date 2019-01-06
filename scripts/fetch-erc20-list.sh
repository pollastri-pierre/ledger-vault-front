#!/bin/env bash
# shellcheck disable=SC2001

# ------
UPSTREAM=git@github.com:LedgerHQ/crypto-assets.git
BRANCH=master
OUTPUT_FILE=src/data/erc20-list.json
# ------

# exit on error
set -e

function main {

  TMP_DIR=$(mktemp -d)
  DIR_TO_SCAN=tokens/ethereum/erc20

  echo "-- cloning from $UPSTREAM"
  git clone "$UPSTREAM" "$TMP_DIR"
  cd "$TMP_DIR"
  git checkout "$BRANCH"
  cd -

  echo "-- concatenating all json files of $DIR_TO_SCAN"
  FULL=$(
    while read -r f ; do
      DIR_NAME=$(dirname "$f")
      OUTPUT="$(cat "$f"), "
      SIG_FILE="$DIR_NAME/ledger_signature.json"
      if [[ -e $SIG_FILE ]]; then
        OUTPUT=$(echo "$OUTPUT" | sed "s/}/, \"signature\": $(cat "$SIG_FILE") }/g")
      else
        >&2 echo "Signature not found for $f"
      fi
      echo -n "$OUTPUT";
    done < <(find "$TMP_DIR/$DIR_TO_SCAN" -name 'common.json')
  )

  echo "[${FULL::-1}]" \
    | ./node_modules/.bin/prettier --stdin --parser json \
    | tee "$OUTPUT_FILE"

  echo "-- saved into $OUTPUT_FILE"

}

function cleanup {
  [[ -n "$TMP_DIR" ]] && rm -rf "$TMP_DIR"
}

trap cleanup EXIT
main
