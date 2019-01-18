#!/bin/env bash
# shellcheck disable=SC2001

# ------
UPSTREAM=git@github.com:LedgerHQ/crypto-assets.git
BRANCH=master
OUTPUT_FILE=src/data/erc20-list.json
# ------

# exit on error
set -e

read -r -d '' LEDGER_COIN << EOM || :
{
  "ticker": "LGC",
  "name": "Ledger Coin",
  "symbol": "LGC",
  "network_id": 3,
  "blockchain_name": "ledger_coin",
  "contract_address": "0x9549e8a940062615cee20c0420c98c25ffa2b214",
  "signature":
    "30450221009bffb4baac8addf4777bf63bba27a460840a8429a9d940b7e8346e7bd8f880230220040587f3102203681cc580c5ccbe6e73741874e62e18a8945b142f70b0f616bf",
  "decimals": 2
}
EOM

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
        OUTPUT=$(echo "$OUTPUT" | sed "s/}/, \"network_id\": 1, \"signature\": $(cat "$SIG_FILE") }/g")
      else
        >&2 echo "Signature not found for $f"
      fi
      echo -n "$OUTPUT";
    done < <(find "$TMP_DIR/$DIR_TO_SCAN" -name 'common.json')
  )

  echo "[$LEDGER_COIN, ${FULL::-1}]" \
    | ./node_modules/.bin/prettier --stdin --parser json \
    | tee "$OUTPUT_FILE"

  echo "-- saved into $OUTPUT_FILE"

}

function cleanup {
  [[ -n "$TMP_DIR" ]] && rm -rf "$TMP_DIR"
}

trap cleanup EXIT
main
