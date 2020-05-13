# vault-front

#### Requirements

- Node.js (LTS or latest)
- Yarn >= 1.5.2
- docker & docker-compose

##### Trust the development certificate

- **Linux**

```bash
sudo trust anchor certificate/localhost.crt
```

- **macOS**

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certificate/localhost.crt
```

## Install

1. Install dependencies

```
yarn
```

2. Setup & run [vault-integration](https://github.com/LedgerHQ/vault-integration). This can be done automatically by using:

```
yarn vault -i
```

for more details about how to use `yarn vault` (ability to automatically onboard, to add real-world users, groups, accounts...), you can check `yarn vault -h`.

You can override any env variable exposed in [vault-integration's docker-compose](https://github.com/LedgerHQ/vault-integration/docker-compose.yml).

For example you can use a local bitcoin blockchain by spawning [regtest](https://github.com/LedgerHQ/ledger-regtest-docker) and overriding the following env vars:

```
# Point at your docker host to find the explorer
export WALLET_BTC_TESTNET_EXPLORER_ENDPOINT=http://172.17.0.1
export WALLET_BTC_TESTNET_EXPLORER_PORT=20000
```

3. Run the front

```
# regular start, nothing prefilled, hardware devices
yarn start

# prefilled organization & software devices
yarn dev

# special case for E2E testing (software devices + no organization prefill)
yarn starte2e
```

## Global, config, localstorage variables used in the app

### Localstorage (can be used to override some config)

| Key                | Default value | Description                                                                                   |
| ------------------ | :-----------: | :-------------------------------------------------------------------------------------------- |
| `TRANSPORT`        |   "webusb"    | Contain the preferred transport, defaults to `webusb` (except if `ONLY_WEBLUE` is set)        |
| `NO_CHECK_VERSION` |     null      | If set to "1", prevent the comparison between the device version and the expected app version |
| `ENABLE_WEBLUE`    |     null      | If set to "1", will make the WeBlue transport appear in Transport chooser                     |
| `ENABLE_SOFTWARE`  |     null      | If set to "1", will make the software transport appear in Transport chooser                   |

### Window config

| Key                        |                 Default value (dev)                  | Description                                                                                        |
| -------------------------- | :--------------------------------------------------: | :------------------------------------------------------------------------------------------------- |
| `APP_VERSION`              |                     `3.0.9-dev`                      | Expected Blue device app version. If the versions differs, user will be prompted to update his app |
| `ERC20_LIST`               |                       `"dev"`                        | Which ERC20 list signatures we should use                                                          |
| `API_BASE_URL`             |               `http://localhost:5000`                | Gate endpoint                                                                                      |
| `DEVICE_REGISTRY_BASE_URL` |              `"http://localhost:5002"`               | Device registry endpoint                                                                           |
| `WEBLUE_URL`               |    `"https://weblue.hsmsaas.ledger.info/weblue"`     | WeBlue server endpoint                                                                             |
| `SPECULOS_WEBLUE_URL`      | `"wss://weblue.hsmsaas.ledger.info/speculos-weblue"` | WeBlue (speculos) server endpoint                                                                  |
| `ENABLE_SOFTWARE`          |                        `true`                        | If software should be enabled in transports list                                                   |
| `ENABLE_WEBLUE`            |                        `true`                        | If WeBlue should be enabled in transports list                                                     |
| `ONLY_WEBLUE`              |                        `true`                        | If `true`, will not display transport list and will force WeBlue                                   |

### env

| Key                 |       Default value       | Description                                                                               |
| ------------------- | :-----------------------: | :---------------------------------------------------------------------------------------- |
| `NODE_ENV`          |       `development`       | Can be `production`, `development`, `e2e`, `test`. It is set at the build time by webpack |
| `NOTIFICATION_PATH` | `/notification/socket.io` | Path for the notification server                                                          |
| `NOTIFICATION_URL`  |            `/`            | Endpoint for the notification server                                                      |
| `ORGANIZATION_NAME` |           `''`            | Used to pre-fill the organization name in login page                                      |
