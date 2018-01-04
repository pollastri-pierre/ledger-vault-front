#!/bin/bash

if [ -z "$REACT_APP_VERSION" ]; then
  echo "Please set a REACT_APP_VERSION env variable to build the project with a version number."
  echo "# REACT_APP_VERSION=1.2 npm run build"
  exit 1
fi

npm run build-css && react-scripts build
