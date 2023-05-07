import React from 'react'
import {useReRender} from './use-re-render'
import {LooseAutoComplete} from './types'

export type UseCreateFormArgs = {
  initialValues?: Record<string, string>
  allowReinitialize?: boolean
  onSubmit?: (values: Record<string, string>) => void
}

export type Listener = (name: string, value: string) => void

export function useCreateForm(args?: UseCreateFormArgs) {
  const {allowReinitialize, initialValues} = args ?? {}
  const reInitializeCountRef = React.useRef(0)
  const reRender = useReRender()

  const submitHandlerRef = React.useRef(args?.onSubmit ?? null)
  submitHandlerRef.current = args?.onSubmit ?? null

  const formRef = React.useRef(
    new FormManager({
      initialValues,
      submitHandlerRef,
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
// - validation
// - strong typing everywhere
// - handling nested form values

export class FormManager {
  values: Record<string, string> = {}
  errors: Record<string, string> = {}
  touched: Record<string, true> = {}

  submitCount: number = 0
  submitHandlerRef: null | React.RefObject<
    (values: Record<string, string>) => void
  > = null

  refObject: React.RefObject<HTMLFormElement> | null = null
  initialValues: Record<string, string> | null = null
  private listeners: Map<string, Listener[]> = new Map()

  constructor(args?: {
    initialValues?: UseCreateFormArgs['initialValues']
    submitHandlerRef: React.RefObject<(values: Record<string, string>) => void>
  }) {
    this.initialValues = args?.initialValues ?? null
    this.values = args?.initialValues ?? {}
    this.submitHandlerRef = args?.submitHandlerRef ?? null
  }

  handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement
    if (!target.name) return
    this.values[target.name] = target.value
    this.invoke(target.name, target.value)
    console.info(`CHANGE: ${target.name}=${target.value}`)
  }

  handleBlur = (e: React.FocusEvent<HTMLFormElement, Element>) => {
    if (!e.target.name) return
    console.info('BLUR: ', e.target.name)
    this.touched[e.target.name] = true
    this.invoke(`touched:${e.target.name}`, true)
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.submitCount++
    console.info('SUBMIT: ', this.values)
    this.submitHandlerRef?.current?.(this.values)
    this.invoke('submitCount', this.submitCount)
  }

  subscribe = (
    nameSubscriptions: Array<LooseAutoComplete<'submitCount'>>,
    listener: Listener,
  ) => {
    nameSubscriptions.forEach((name) => {
      const listeners = this.listeners.get(name as string) || []
      listeners.push(listener)
      this.listeners.set(name as string, listeners)
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

  invoke = (name: string, value: any) => {
    if (!this.listeners.has(name)) return
    this.listeners.get(name)!.forEach((listener) => listener(name, value))
  }

  register = (name: string) => {
    const defaultValue = this.initialValues?.[name] ?? undefined
    return {name, defaultValue}
  }

  reset = () => {
    this.refObject?.current?.reset()
    this.values = this.initialValues ?? {}
  }
}
