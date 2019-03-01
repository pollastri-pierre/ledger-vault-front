# vault-front

#### Requirements

- Node.js 8.11.3
- npm 5.6.0
- docker & docker-compose

Generate a self-signed certificate for `localhost`:

```bash
bash scripts/generate-self-signed-cert.sh
```

## Install

1. Install dependencies

```
npm install
```

2. Setup & run [vault-integration](https://github.com/LedgerHQ/vault-integration)
3. Launch development server

```
npm run start

# or, if you want mock devices:
npm run starte2e
```
