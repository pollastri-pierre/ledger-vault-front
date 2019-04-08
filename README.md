# vault-front

#### Requirements

- Node.js (LTS or latest)
- Yarn >= 1.5.2
- docker & docker-compose

Generate a self-signed certificate for `localhost`:

```bash
bash scripts/generate-self-signed-cert.sh
```

## Install

1. Install dependencies

```
yarn
```

2. Setup & run [vault-integration](https://github.com/LedgerHQ/vault-integration)
3. Launch development server

```
yarn start

# or, if you want mock devices:
yarn starte2e
```
