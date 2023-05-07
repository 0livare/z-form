import React from 'react'
import {useCreateForm} from './use-create-form'
import {FormContext} from './context'

export type FormProps = Omit<React.ComponentProps<'form'>, 'onSubmit'> & {
  form: ReturnType<typeof useCreateForm>
  onSubmit?: (
    e: React.FormEvent<HTMLFormElement>,
    values: Record<string, string>,
  ) => void
}

export function Form(props: FormProps) {
  const {form, children, onSubmit, ...rest} = props
  const rootRef = React.useRef<HTMLFormElement>(null)
  form.formElRef = rootRef

  return (
    <form
      {...rest}
      ref={rootRef}
      onChange={form.handleChange}
      onBlur={form.handleBlur}
      onSubmit={(e) => {
        form.handleSubmit(e)
        onSubmit?.(e, form.values)
      }}
    >
      <FormContext.Provider value={form}>{children}</FormContext.Provider>
    </form>
  )
}
