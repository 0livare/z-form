import type {ZodError, ZodSchema} from 'zod'
import type {ValidationAdapter} from './validation-types'

export const zodValidationAdapter: ValidationAdapter = (
  zodSchema: ZodSchema,
  value: unknown,
) => {
  try {
    zodSchema.parse(value)
    return null
  } catch (e) {
    const error = e as ZodError

    // TODO: This does not properly support nested objects
    const errorMessages = error.issues.reduce((accum, issue) => {
      const {path, message} = issue
      return {...accum, [path.join('.')]: message}
    }, {})

    return errorMessages
  }
}
