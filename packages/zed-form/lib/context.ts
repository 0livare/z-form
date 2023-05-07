import React from 'react'
import {FormManager, useCreateForm} from './use-create-form'

export type FormContextShape = null | ReturnType<typeof useCreateForm>

export const FormContext = React.createContext<FormContextShape>(null)

export function useFormContext() {
  return React.useContext(FormContext)
}
