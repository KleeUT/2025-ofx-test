# Missing local dev instructions

## Missing setup requirements

Docker desktop
SAM CLI

Ensure docker's bin directory is on path `export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"`

## Executing

### Generate template

`npm cdk synth`

### Execute with SAM

`npm run cdk synth`
`sam local start-api  -t ./cdk.out/BeTestStack.template.json`

# Issues with the application

## Outdated node version

Using 16 -> Update to node 22

## Missing Formatting and linting

- Adopt ESLint to reduce risk of errors
- Adopt Prettier to minimise formatting based conflicts

## Compilation required to run tests

Move from Jest to ts-jest to ensure that the tests are testing the current code.

## Structure

### Tests

It's a personal preference but I find having the test files next to the implementation helps to make a more portable unit. When a file and it's tests are moved to a new location imports are updated together.

### TypeScript output

Using an external directory for transpiler output avoids clutter in the file tree.

# Issues with the code

## getPayments tests

The tests for get payment are inadequate and don't cover the behaviour that should be in
