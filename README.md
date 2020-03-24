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

### Globals

| Key              | Default value | Description                              |
| ---------------- | :-----------: | :--------------------------------------- |
| `FORCE_HARDWARE` |       0       | If set to 1, force using hardware device |

### Localstorage

| Key                | Default value | Description                                                                    |
| ------------------ | :-----------: | :----------------------------------------------------------------------------- |
| `TRANSPORT`        |     "u2f"     | Contain the preferred transport
| `NO_CHECK_VERSION` |     null      | Prevent the comparison between the device version and the expected app version |
| `ENABLE_WEBLUE`    |     null      | If set to "1", will make the WeBlue transport appear in Transport chooser      |
| `locale`           |      en       | Forwarded to i18next                                                           |
| `token`            |     null      | Will fill the X-Ledger-Auth header for Gate calls                              |

### Window config

| Key               |      Default value      | Description                                                                                                      |
| ----------------- | :---------------------: | :--------------------------------------------------------------------------------------------------------------- |
| `SOFTWARE_DEVICE` |            0            | If set to 1, software device is used                                                                             |
| `APP_VERSION`     |        `1.0.17`         | Represent the expected Blue device app version. If the versions differs, user will be prompted to update his app |
| `API_BASE_URL`    | `http://localhost:5000` | Gate endpoint                                                                                                    |

### env

| Key                   |       Default value       | Description                                                                               |
| --------------------- | :-----------------------: | :---------------------------------------------------------------------------------------- |
| `NODE_ENV`            |       `development`       | Can be `production`, `development`, `e2e`, `test`. It is set at the build time by webpack |
| `NOTIFICATION_PATH`   | `/notification/socket.io` | Path for the notification server                                                          |
| `NOTIFICATION_URL`    |            `/`            | Endpoint for the notification server                                                      |
| `ORGANIZATION_NAME`   |           `''`            | Used to pre-fill the organization name in login page                                      |
| `DEBUG_COUNTERVALUES` |           `''`            | If set, enable logging in countervalues service                                           |
