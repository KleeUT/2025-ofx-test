type ValidationResult =
  | { valid: true }
  | { valid: false; error: ValidationError };

export type ValidationError = { path: string; error: string };
export type Validator = (val: unknown) => ValidationResult;
export type Validators = { [key: string]: Validator };

// reviewer note: hand written validation logic like this doesn't scale to large systems. For a larger system I'd look to implement a schema validation library
// Really this implementation is over-engineering for the current situation
export function validate(
  object: { [key: string]: unknown },
  validators: Validators,
): Array<ValidationError> {
  const errors: Array<ValidationError> = [];

  for (let key of Object.keys(object)) {
    const validator = validators[key];
    if (!validator) {
      errors.push({
        path: key,
        error: `${key} is not allowed`,
      });
    } else {
      const result = validator(object[key]);
      if (!result.valid) {
        errors.push(result.error);
      }
    }
  }

  return errors;
}
