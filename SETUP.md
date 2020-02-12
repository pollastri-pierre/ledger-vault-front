# Vault environment setup

This is the starting point for the Vault setup meeting.
You should have all those requirements, else you will have a hard time.

If you have Windows, sorry we don't support. So please setup a Linux VM lol.

## Requirements

### Accounts & rights

- Have a [GitHub](https://github.com/) account and be part of the [LedgerHQ](https://github.com/LedgerHQ) organization
- Have a [DockerHub](https://hub.docker.com/) account and be part of the [ledgerhq](https://hub.docker.com/orgs/ledgerhq) organization
- Have setup SSH keys with GitHub account (see [instructions](https://help.github.com/en/enterprise/2.17/user/github/authenticating-to-github/connecting-to-github-with-ssh))
- Have setup GPG key (see [instructions](https://help.github.com/en/github/authenticating-to-github/generating-a-new-gpg-key))

### Packages & libs

- [Node.js](https://nodejs.org/en/) (>= LTS)
- [Yarn](https://yarnpkg.com/)

For Mac users, the recommended way is to use [brew](https://brew.sh/) package manager.

```
# it will install yarn (and also node if not installed)
brew install yarn
```

- [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/)
- [Python](https://www.python.org/) >= 3.7.6

### Certificate

Please send me your GPG public key so I can send you the certif

```
gpg --armor --export <email>
```