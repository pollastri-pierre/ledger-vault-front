#!/usr/bin/env bash
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
  "hsm_account_parameters": "0a2089b72e7e944c38797e4a3667a0ee7f6f17884e96a0dcb1835c952f80b355190910011a1c0a1a080312149549e8a940062615cee20c0420c98c25ffa2b214180222310a034c4743122a307839353439653861393430303632363135636565323063303432306339386332356666613262323134",
  "hsm_signature": "3045022100d8838955fa5311777379ec3a36192380323a46933426a476977a68d47b465ea7022064161a3a67b31bb50890a385357983e612fa62ba00702c151df4e104fb18c1ea"
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
      SIG_FILE="$DIR_NAME/vault_signature.json"
      if [[ -e $SIG_FILE ]]; then
        OUTPUT=$(echo "$OUTPUT" | sed "s/}/, $(grep "account_parameters" "$SIG_FILE") $(grep "signature" "$SIG_FILE") }/g")
      else
        >&2 echo "Signature not found for $f"
      fi
      echo -n "$OUTPUT";
    done < <(find "$TMP_DIR/$DIR_TO_SCAN" -name 'common.json')
  )
  FULL=$(echo "$FULL" | sed "s/\(account_parameters\|signature\)/hsm_\1/g")

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
