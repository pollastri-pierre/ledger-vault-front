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

for more details about how to use `yarn vault` (ability to automatically onboard, to add real-world users, groups, accounts...), you can check `yarn vault -h`

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

| Key        | Default value           | Description         |
| ------------- |:-------------:| :-----:|
| FORCE_HARDWARE     | 0 | If set to 1, force using hardware device|

### Localstorage

| Key        | Default value           | Description  |
| ------------- |:-------------:| :-----:|
| NO_CHECK_VERSION      |  | indicates if the app version was checked  |
| locale      | en      |   language determination |
| token | null     |    string value used for the auth purposes |

### Window config

| Key        | Default value           | Description  |
| ------------- |:-------------:| :-----:|
| SOFTWARE_DEVICE      | 0 | If set to 1, software device is used |
| APP_VERSION      |  `1.0.17`     |   self explanatory |
| API_BASE_URL | `http://localhost:5000`      |   self explanatory   |

### env

| Key        | Default value           | Description  |
| ------------- |:-------------:| :-----:|
| NODE_ENV     |  |  |
| NOTIFICATION_PATH      | `/notification/socket.io`      |   self explanatory  |
| NOTIFICATION_URL | `/`      |    self explanatory |
| ORGANIZATION_NAME | `''`      |    self explanatory |
| DEBUG_COUNTERVALUES | `shrug`      |     |
| MOCK_SEED | 1234      |    self explanatory |


