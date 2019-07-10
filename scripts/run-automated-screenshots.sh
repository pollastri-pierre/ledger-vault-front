#!/bin/bash

if [[ "$RESET" == "1" ]]; then
  yarn vault -i onboarding screenshots
fi

rm -rf screenshots
mkdir screenshots

node scripts/screenshots.js
