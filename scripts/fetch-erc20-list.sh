#!/usr/bin/env bash
# shellcheck disable=SC2001

# ------
UPSTREAM=git@github.com:LedgerHQ/crypto-assets.git
OUTPUT_FILES="LVFM-318,erc20-list hsm-simu-ATP,erc20-list.dev"
OUTPUT_PATH=src/data
DIR_TO_SCAN=tokens/ethereum/erc20
# ------

# exit on error
set -e

read -r -d '' LEDGER_COIN << EOM || :
{
  "ticker": "LGC",
  "name": "Ledger Coin",
  "blockchain_name": "ropsten",
  "contract_address": "0x9549E8A940062615ceE20C0420C98c25Ffa2b214",
  "decimals": 2,
  "hsm_account_parameters": "0a20f28d7660b250ad6d5aec3d30f4acbb9002c5ecf61bc18f48d1f901c89f877a0c10021a1a0a18080112149549e8a940062615cee20c0420c98c25ffa2b21422cd050a034c47432208657468657265756da206120a05657263323012090a070a034c47431002a206380a046d61696e12300a070a0345544810120a080a044777656910090a080a044b77656910030a080a044d77656910060a070a035765691000aa06240a126163636f756e742e626c6f636b636861696e120e0a00220a426c6f636b636861696eaa061b0a0c6163636f756e742e6e616d65120b0a0022074163636f756e74aa061c0a0e6163636f756e742e7469636b6572120a0a0022065469636b6572aa061d0a046164647212150a002211526563697069656e742061646472657373aa061b0a06616d6f756e74121112070a0565726332302206416d6f756e74aa061e0a0a6574682e616d6f756e74121012060a046d61696e2206416d6f756e74aa06240a0b6574682e6473746164647212150a002211526563697069656e742061646472657373aa062e0a196574682e65726332302e7472616e736665722e616d6f756e74121112070a0565726332302206416d6f756e74aa062e0a156574682e65726332302e7472616e736665722e746f12150a002211526563697069656e742061646472657373aa06240a086574682e66656573121812060a046d61696e220e4d617820746f74616c2066656573aa061d0a0c6574682e6761734c696d6974120d1a002209476173206c696d6974aa06230a0c6574682e6761735072696365121312060a046d61696e2209476173207072696365aa06200a0466656573121812060a046d61696e220e4d617820746f74616c2066656573aa06190a086761734c696d6974120d1a002209476173206c696d6974aa061f0a086761735072696365121312060a046d61696e2209476173207072696365b20651a2064e0a080a060a04616464720a100a0e0a0c6163636f756e742e6e616d650a0a0a080a06616d6f756e740a0c0a0a0a0867617350726963650a0c0a0a0a086761734c696d69740a080a060a0466656573",
  "hsm_signature": "30440220300f7501e6f6a632c9ec7c579720d8e3db733a0cfbc4a6b83f5c8dc22bc5ad0b022061ccef353e54ac09d4c14a6e54b55918e0e5d9151ebef64cfe246e13cd88655e"
}
EOM

function main {
  TMP_DIR=$(mktemp -d)

  echo "-- cloning from $UPSTREAM"
  git clone "$UPSTREAM" "$TMP_DIR"


  for i in $OUTPUT_FILES; do IFS=","; set -- $i;
    cd "$TMP_DIR"
    git checkout "$1"
    cd -
    fetch_list $TMP_DIR "$OUTPUT_PATH/$2.json";
  done
}

function fetch_list {
  TMP_DIR="$1"
  OUTPUT_FILE="$2"

  echo "-- concatenating all json files of $DIR_TO_SCAN"
  FULL=$(
    while read -r f ; do
      DIR_NAME=$(dirname "$f")
      OUTPUT="$(cat "$f"), "
      SIG_FILE="$DIR_NAME/vault_signature.json"
      if [[ -e $SIG_FILE ]]; then
        OUTPUT=$(echo "$OUTPUT" | sed "s/}/, $(grep "account_parameters" "$SIG_FILE") $(grep "signature" "$SIG_FILE") }/g")
        echo -n "$OUTPUT";
      else
        >&2 echo "Signature not found for $f"
      fi
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
