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
