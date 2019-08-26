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
