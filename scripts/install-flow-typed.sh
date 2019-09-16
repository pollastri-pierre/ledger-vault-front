#!/bin/env bash

set -e
./node_modules/.bin/flow-typed install -s
rm -rf flow-typed/npm/{redux_*,react-router_*,react-redux_*,styled-components_*,redux-devtools-extension_*,react-hot-loader_*}
