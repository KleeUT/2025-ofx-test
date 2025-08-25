# Notes for the reviewer

## Development experience

I've made some upgrades to the development experience in this repository.

### Documentation

I've added [DEVELOPING.md](developing.md) with instructions on getting started in this repo.

### formatting

I've added Prettier to ensure that code is consistently formatted keeping PR diffs small.

### Linting

I've added linting with the default ruleset to catch code smells early and ensure consistent standards are applied.

### Pre-commit hooks

Linting and formatting are only worth while if they're run so I've added Husky for pre-commit git hooks with lint-staged to apply linting and formatting to all committed files before they're committed.

## Testing

I've added unit tests to cover all the questions and extended them to cover existing functionality.

## Library upgrades

I've upgraded to use Node 22 and the latest version of CDK.

## Continuous Integration

I've set up github actions to run on every push to ensure that the linting, formatting, and testing is run constantly.

# Code callouts

## Dynamo object injection

I've made some changes to inject the dynamo object into the payments file. This helps by making the payments file easier to test by allowing easy mocking of the dependency.

If I were to continue this solution into a real life application I'd go further with using injection compose functionality rather than coupling files together with broad use of `import`.

## Validation

I've added an abstract validation function that can be used to validate input. This is over engineering for this scale of project. For a larger scale project I'd look at using a library to provide more thorough validation.

### Valid currencies

I've taken the list of valid currencies from the OFX website. The question didn't specify what validation to add so I chose to include ensuring that the currency is a supported one to avoid creating a payment in a non-supported currency.

### Valid transactions

I made the assumption that valid payments will be positive numbers greater than zero.
