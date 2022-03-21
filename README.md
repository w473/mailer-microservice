# mailing-microservice
## Description
Microservice for sending emails.

Possibilities:
- template 
  - add
  - delete
  - update
- email
  - find
  - send using template

## Installation

```bash
$ npm ci
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# tests coverage
$ npm run test:cov
```

## Docker images:
ghcr.io/w473/mailer-microservice:latest

and

ghcr.io/w473/mailer-microservice:TAG

e.g.

ghcr.io/w473/mailer-microservice:0.0.1

