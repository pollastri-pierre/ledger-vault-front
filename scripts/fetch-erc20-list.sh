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
  "contract_address": "0x9549E8A940062615ceE20C0420C98c25Ffa2b214",
  "decimals": 2,
  "hsm_account_parameters": {
      "unique_id": "0000000000000000000000000000000000000000000000000000000000000007",
      "parameters": "080312149549E8A940062615CEE20C0420C98C25FFA2B2141802",
      "psd_parameters": "0A034C4743122A307839353439653861393430303632363135636565323063303432306339386332356666613262323134"
  }
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
