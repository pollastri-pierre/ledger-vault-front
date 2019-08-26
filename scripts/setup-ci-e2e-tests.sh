#!/bin/bash
# shellcheck disable=SC2155

set -e

# exit properly if commit doesn't contain --e2e
if ! (git log --oneline -n 1 --pretty=format:%B | grep -- '--e2e' &>/dev/null); then
  echo "Commit message or description does not contain --e2e, skipping tests."
  exit 0
fi

export ORGANIZATION_API_TOKEN=''
export WALLET_DAEMON_VERSION=develop-drop2
export VAULT_API_VERSION=develop-drop2
export DEVICE_API_VERSION=develop-hsm2
export HSM_DRIVER_VERSION=develop-hsm2
export VAULT_HSM_ENDPOINT=https://hsmsaas.ledger.info/dev/20190620/process
export COMPARTMENTS_ENDPOINT=https://hsmsaas.ledger.info/dev/20190620/compartments
export VAULT_WORKSPACE=ledger1

cat > .env << EOF
API_BASE_URL=http://localhost:5000
APP_VERSION=2.0.0-dev
NOTIFICATION_URL=http://localhost:3033
EOF

function main {
  echo "-- installing deps"
  sudo apt-get update
  sudo apt-get install --fix-missing xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 || true

  echo "-- cloning / pulling vault-integration repository"
  cloneOrPull git@github.com:LedgerHQ/vault-integration.git

  echo "-- pulling the docker images"
  docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" &>/dev/null

  echo "-- setup environment"
  openssl pkcs12 -in certificates/hsm-circle-ci.pfx -out hsm-circle-ci.pem -nodes -password env:VAULT_HSM_CLIENT_CERT_PWD
  export VAULT_COMPARTMENT_ID=$(curl -k --header "Content-Type: application/json" --request POST --data '{}' --cert hsm-circle-ci.pem "$COMPARTMENTS_ENDPOINT" | jq ".id")

  echo "-- VAULT_COMPARTMENT_ID: $VAULT_COMPARTMENT_ID"

  # prepare clean in next step
  echo "export VAULT_COMPARTMENT_ID=$VAULT_COMPARTMENT_ID" >> "$BASH_ENV"
  echo "export COMPARTMENTS_ENDPOINT=$COMPARTMENTS_ENDPOINT" >> "$BASH_ENV"

  echo "-- starting the docker images"
  echo "the hsm endpoint is $VAULT_HSM_ENDPOINT"
  VAULT_HSM_ENDPOINT=$VAULT_HSM_ENDPOINT docker-compose up -d

  echo "-- waiting for healthyness"
  waitForHealthyContainers 9

  echo "-- starting e2e server"
  cd ..
  npm run starte2e &

  echo "-- waiting for e2e server to be up"
  waitForE2EServer

  echo "-- server is up!"
  echo "-- launching e2e tests"

  export PATH=./node_modules/.bin:$PATH

  cypress install
  cypress run --reporter junit --spec 'cypress/integration/Onboarding/*'
  cypress run --reporter junit --spec 'cypress/integration/Drop2/01_Users/*'
  cypress run --reporter junit --spec 'cypress/integration/Drop2/02_Groups/*'
}

function cloneOrPull {
  if ! [[ -d vault-integration ]]; then
    git clone "$1" >/dev/null
    cd vault-integration
  else
    cd vault-integration
    git pull
  fi
}

function waitForHealthyContainers {
  MAX_RETRIES=60
  while [[ $HEALTHY_CONTAINERS != "$1" ]]; do
    sleep 1
    HEALTHY_CONTAINERS=$(docker ps --format '{{.Status}}' | grep -c '(healthy)$' || echo "0")
    MAX_RETRIES=$((MAX_RETRIES - 1))
    echo "retrying... (remaining attemps: $MAX_RETRIES)"
    if [[ $MAX_RETRIES == "0" ]]; then
      echo "max retries reached, exiting"
      exit 1
    fi
  done
}

function waitForE2EServer {
  MAX_RETRIES=60
  while ! curl -k --connect-timeout 1 https://localhost:9000 &>/dev/null ; do
    sleep 1
    MAX_RETRIES=$((MAX_RETRIES - 1))
    echo "retrying... (remaining attemps: $MAX_RETRIES)"
    if [[ $MAX_RETRIES == "0" ]]; then
      echo "max retries reached, exiting"
      exit 1
    fi
  done
}

main
