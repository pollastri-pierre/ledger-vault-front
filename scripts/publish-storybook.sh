#!/bin/bash

set -e

npm run build-storybook
cd storybook-static
git init
git checkout -b gh-pages
git add .
git commit -m 'Build storybook'
git remote add origin git@github.com:LedgerHQ/ledger-vault-front.git
git push -f origin gh-pages
