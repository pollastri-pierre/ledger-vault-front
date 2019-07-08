#!/bin/env bash

set -e

./node_modules/.bin/flow-typed install -s
rm -rf flow-typed/npm/{redux_v4.x.x.js,react-router_v4.x.x.js,react-redux_v5.x.x.js,styled-components_v4.x.x.js,redux-devtools-extension_v2.x.x.js}
