# Testing

Unit tests are written using Jest.
Run tests using `npm test`
Continually run tests covering changes since the last commit with `npm run test:watch`

# Deploying

### AWS credentials

Ensure that AWS credentials are set up

### Deploy code

To deploy the code run
`npm run deploy`

# Running locally

### Build the code

Build the code
`npm run build`

### Generate CDK template

Run `npm run cdk synth` to generate the CDK template pointing to AWS.

### Start the server

Start the local server using
`sam local start-api  -t ./cdk.out/BeTestStack.template.json`

## Sample requests

Create a payment in the local server.
`curl -X POST -H "Content-Type: application/json" -d '{"currency": "AUD", "amount": 100}' http://localhost:3000/payments`

List payments on the local server
`curl http://localhost:3000/payments`

List payments on the local server by a currency ([all currencies](src/currencies.ts))

`curl http://localhost:3000/payments?currency=AUD`

Get a payment from the local server
`curl http://localhost:3000/payments/{payment id}`

# Linting

This repo is using Prettier as a code formatter and eslint for correctness checking.

## Pre-commit hook

To run linting on every commit you need to run `npm run prepare` after installing dependencies to set up Husky git hooks.
The husky hook uses `lint-staged` to only lint and format committed files.
