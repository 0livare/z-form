import React from 'react'
import {useFormContext} from './context'

type InputProps = Omit<React.ComponentProps<'input'>, 'children'>

export type FieldProps =
  | ({
      type: 'text'
      name: string
    } & InputProps)
  | ({
      type: 'checkbox'
      name: string
      value?: string
    } & InputProps)
  | ({
      type: 'radio'
      name: string
      value: string
    } & InputProps)
  | ({
      type: 'select'
      name: string
    } & React.ComponentProps<'select'>)

export function Field(props: FieldProps) {
  const {type, name, value, ...rest} = props

  const {register} = useFormContext()
  const Component = props.type === 'select' ? 'select' : 'input'
  return (
    <Component {...(rest as any)} {...register({type, name, value} as any)} />
  )
}
