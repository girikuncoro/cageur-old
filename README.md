# Cageur Codebase
Cageur (preventive health technology) code base for BPJS market in Indonesia. We aim to own the largest healthcare system in the country.

# Setup
This project is currently setup for Unix.
## Requirements
Download and install from https://nodejs.org
- Node 5.9.1
- NPM >= 3

## How to Install
- Clone this repo
```
$ git clone https://github.com/girikuncoro/cageur.git
```
- Install package dependencies
```
$ cd cageur
$ npm install
```
- Install heroku command line from https://devcenter.heroku.com/articles/heroku-command-line or brew
```
$ brew install heroku-toolbelt
```
- Install mongodb community edition locally for testing purpose https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/ and create `mongo_data/db` directory
```
$ brew install mongodb
$ mkdir -p mongo_data/db
```

## Common Development Task
- Run the mocha test scripts
```
$ npm run test
```
- Run the eslint for all js files
```
$ npm run lint
```
- Run both the test and lint
```
$ npm run dev
```
- Run local db server for development
```
$ npm run db:dev
```
- Run local db server for testing
```
$ npm run db:test
```
