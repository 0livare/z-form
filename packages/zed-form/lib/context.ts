import React from 'react'
import type {FormManager} from './use-create-form'

export type FormContextShape = null | FormManager
export const FormContext = React.createContext<FormContextShape>(null)

export function useFormContext() {
  const form = React.useContext(FormContext)
  return {form, register: form?.register}
}
