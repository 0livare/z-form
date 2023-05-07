import React from 'react'
import {FormContextShape, useFormContext} from './context'
import {Listener} from './use-create-form'

export function useFormValue<
  T extends Record<string, any> = Record<string, any>,
  K extends keyof T = keyof T,
>(
  name: K extends string
    ? K | `touched:${K}` | `error:${K}` | 'submitCount' | undefined
    : never,
  form: FormContextShape | undefined = undefined,
): T[K] | undefined {
  const contextForm = useFormContext()
  const finalForm = form || contextForm

  if (!finalForm && process.env.NODE_ENV === 'development') {
    throw new Error(
      'useFormValue must be used within a ZedForm context or passed a form instance',
    )
  }

  const [value, setValue] = React.useState<T[K] | undefined>(() => {
    return finalForm?.getListenerValue(name as string) as T[K] | undefined
  })

  React.useEffect(() => {
    if (!finalForm) return

    const listener: Listener = (name, value) => {
      setValue(value as T[K])
    }

    finalForm.subscribe([name as string], listener)
    return () => finalForm.unsubscribe([name as string], listener)
  }, [])

  return value
}
