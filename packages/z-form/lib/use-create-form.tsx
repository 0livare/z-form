import React from 'react'
import debounce from 'lodash/debounce'

import {useReRender} from './use-re-render'
import {LooseAutoComplete} from './types'
import {zodValidationAdapter} from './validation/zod-adapter'
import {ValidationAdapter} from './validation/validation-types'

export type UseCreateFormArgs = {
  initialValues?: Record<string, string>
  allowReinitialize?: boolean
  onSubmit?: (values: Record<string, string>) => void
  validationSchema?: any
  validationAdapter?: ValidationAdapter
}

export type Listener = (name: string, value: any) => void

export function useCreateForm(args?: UseCreateFormArgs) {
  const {
    allowReinitialize,
    initialValues,
    onSubmit,
    validationSchema,
    validationAdapter,
  } = args ?? {}

  const reInitializeCountRef = React.useRef(0)
  const reRender = useReRender()

  const submitHandlerRef = React.useRef(onSubmit ?? null)
  submitHandlerRef.current = onSubmit ?? null

  const validationSchemaRef = React.useRef(validationSchema ?? null)

  const formRef = React.useRef(
    new FormManager({
      initialValues,
      submitHandlerRef,
      validationSchemaRef,
      validationAdapter,
    }),
  )

  React.useEffect(() => {
    if (reInitializeCountRef.current > 30) {
      const message =
        'initialValues passed to useCreateForm() MUST be memoized when allowReinitialize is passed. You can either remove allowReinitialize or wrap the initialValues in useMemo() before passing it to useCreateForm().'

      if (process.env.NODE_ENV === 'development') {
        throw new Error(message)
      } else if (reInitializeCountRef.current > 100) {
        console.error(message)
        return
      }
    }

    if (!initialValues) return
    if (allowReinitialize) {
      reInitializeCountRef.current = reInitializeCountRef.current + 1
      formRef.current.initialValues = initialValues ?? null
      formRef.current?.reset()
      reRender()
    }
  }, [initialValues])

  return formRef.current as FormManager
}

// TODO:
// - strong typing everywhere
// - handling nested form value objects

export class FormManager {
  values: Record<string, string> = {}
  touched: Record<string, true> = {}

  submitCount: number = 0
  submitHandlerRef: null | React.RefObject<
    (values: Record<string, string>) => void
  > = null

  formElRef: React.RefObject<HTMLFormElement> | null = null
  initialValues: Record<string, string> | null = null
  private listeners: Map<string, Listener[]> = new Map()

  errors: Record<string, string> = {}
  isValid: boolean = true
  private validationSchemaRef: null | React.RefObject<any> = null
  private validationAdapter: null | ValidationAdapter = null

  constructor(args?: {
    initialValues?: UseCreateFormArgs['initialValues']
    submitHandlerRef: React.RefObject<(values: Record<string, string>) => void>
    validationSchemaRef: React.RefObject<any>
    validationAdapter?: ValidationAdapter
  }) {
    this.initialValues = args?.initialValues ?? null
    this.values = args?.initialValues ?? {}
    this.submitHandlerRef = args?.submitHandlerRef ?? null
    this.validationSchemaRef = args?.validationSchemaRef ?? null
    this.validationAdapter = args?.validationAdapter ?? zodValidationAdapter
  }

  handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement
    if (!target.name) return
    this.values[target.name] = target.value
    this.invokeListenersFor(target.name, target.value)
    console.info(`CHANGE: ${target.name}=${target.value}`)
    this.validate()
  }

  handleBlur = (e: React.FocusEvent<HTMLFormElement, Element>) => {
    if (!e.target.name) return
    console.info('BLUR: ', e.target.name)
    this.touched[e.target.name] = true
    this.invokeListenersFor(`touched:${e.target.name}`, true)
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.submitCount++
    console.info('SUBMIT: ', this.values)
    this.submitHandlerRef?.current?.(this.values)
    this.invokeListenersFor('submitCount', this.submitCount)
  }

  subscribe = (
    nameSubscriptions: Array<LooseAutoComplete<'submitCount'>>,
    listener: Listener,
  ) => {
    nameSubscriptions.forEach((name) => {
      const listeners = this.listeners.get(name as string) || []
      listeners.push(listener)
      this.listeners.set(name as string, listeners)

      const currentValue = this.getListenerValue(name as string)
      listener(name as string, currentValue)
    })
  }

  unsubscribe = (nameSubscriptions: string[], listener: Listener) => {
    nameSubscriptions.forEach((name) => {
      if (this.listeners.has(name)) {
        const listeners = this.listeners.get(name)!
        const index = listeners.indexOf(listener)
        if (index !== -1) {
          listeners.splice(index, 1)
        }
      }
    })
  }

  invokeListenersFor = (name: string, value?: any) => {
    if (!this.listeners.has(name)) return

    if (value !== undefined) {
      const val = value ?? this.getListenerValue(name)
      this.listeners.get(name)!.forEach((listener) => listener(name, val))
      return
    }
  }

  getListenerValue = (
    name: LooseAutoComplete<'submitCount' | 'touched' | 'errors'>,
  ) => {
    if (name === 'submitCount') return this.submitCount
    if (name === 'touched') return this.touched
    if (name === 'errors') return this.errors
    if (name === 'isValid') return this.isValid

    if (name.includes(':')) {
      const [type, realName] = name.split(':')
      if (!realName) return
      if (type === 'touched') {
        return this.touched[realName] ?? false
      }
      if (type === 'error') {
        return this.errors[realName] ?? null
      }
    }

    return this.values[name as string]
  }

  register = (name: string) => {
    const defaultValue = this.initialValues?.[name] ?? undefined
    return {name, defaultValue}
  }

  reset = () => {
    this.formElRef?.current?.reset()
    this.values = this.initialValues ?? {}
  }

  validate = debounce(() => {
    let schema = this.validationSchemaRef?.current
    if (schema) {
      let errors = this.validationAdapter?.(schema, this.values)
      if (errors) {
        const fieldNamesWithErrors = Object.keys(errors)
        fieldNamesWithErrors.forEach((name) =>
          this.invokeListenersFor(`error:${name}`, errors![name]),
        )

        this.errors = errors
        this.isValid = false
        this.invokeListenersFor('errors')
        this.invokeListenersFor('isValid')
        return
      }
    }

    if (!this.isValid) {
      const oldErrors = Object.keys(this.errors)
      this.errors = {}
      this.isValid = true

      this.invokeListenersFor('errors')
      this.invokeListenersFor('isValid')
      oldErrors.forEach((name) =>
        this.invokeListenersFor(`error:${name}`, null),
      )
    }
  }, 200)
}
