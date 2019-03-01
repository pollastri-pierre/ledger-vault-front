#!/bin/bash

set -e

rm -rf storybook-static
npm run build-storybook
cd storybook-static
git init
git checkout -b gh-pages
git add .
git commit -m 'Build storybook [skip ci]'
git remote add origin git@github.com:LedgerHQ/ledger-vault-front.git
git push -f origin gh-pages
