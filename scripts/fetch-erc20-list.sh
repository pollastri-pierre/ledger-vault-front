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
  "blockchain_name": "ropsten",
  "contract_address": "0x57e8ba2A915285f984988282aB9346c1336a4E11",
  "signature":
    "3044022058a64ae298165a2429d92496055e23d9add0a0f2fa8f0d890d654bf521d9f6db02207745d7924bae2399faa63ea46b00b4eea32b3bbff19e15e79f27ed9ac5b078e8",
  "decimals": 18
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
        OUTPUT=$(echo "$OUTPUT" | sed "s/}/, \"signature\": $(cat "$SIG_FILE") }/g")
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
