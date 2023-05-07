import React from 'react'
import {FormContextShape, useFormContext} from './context'
import {Listener} from './use-create-form'

export type UseFormListenerArgs = {}

export function useFormListener<
  T extends Record<string, any> = Record<string, any>,
  K extends keyof T = keyof T,
>(name: K, form: FormContextShape | undefined = undefined): T[K] | undefined {
  const contextForm = useFormContext()
  const finalForm = form || contextForm

  if (!finalForm && process.env.NODE_ENV === 'development') {
    throw new Error(
      'useFormListener must be used within a FormContext or passed a form instance',
    )
  }

  const [state, setState] = React.useState<T[K] | undefined>(() => {
    return finalForm?.values[name as string] as T[K] | undefined
  })

  React.useEffect(() => {
    if (!finalForm) return

    const listener: Listener = (name, value) => {
      setState(value as T[K])
    }

    finalForm.subscribe([name as string], listener)
    return () => finalForm.unsubscribe([name as string], listener)
  }, [])

  return state
}
