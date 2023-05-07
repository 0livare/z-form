import React from 'react'
import {Nullable} from './types'
import {useReRender} from './use-re-render'

export type UseCreateFormArgs = {
  initialValues?: Record<string, string | null | undefined>
  allowReinitialize?: boolean
}

export type Listener = (name: string, value: string) => void

export function useCreateForm(args?: UseCreateFormArgs) {
  const {allowReinitialize, initialValues} = args ?? {}

  const reRender = useReRender()
  const formManagerRef = React.useRef(new FormManager(args))

  React.useEffect(() => {
    if (allowReinitialize) {
      formManagerRef.current.initialValues = initialValues ?? null
      reRender()
    }
  }, [initialValues])

  return formManagerRef.current as FormManager
}

// TODO:
// - initialValues
// - allowReinitialize
// - validation
// - submitCount
// - submission process
// - string typing everywhere
// - handling nested form values

export class FormManager {
  readonly values: Record<string, string> = {}
  readonly errors: Record<string, string> = {}
  readonly touched: Record<string, true> = {}

  initialValues: Record<string, Nullable<string>> | null = null
  private listeners: Map<string, Listener[]> = new Map()

  constructor(args?: UseCreateFormArgs) {
    this.initialValues = args?.initialValues ?? null
  }

  handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement
    if (!target.name) return
    this.values[target.name] = target.value

    if (this.listeners.has(target.name)) {
      this.listeners.get(target.name)!.forEach((listener) => {
        listener(target.name, target.value)
      })
    }
    console.info(`CHANGE: ${target.name}=${target.value}`)
  }

  handleBlur = (e: React.FocusEvent<HTMLFormElement, Element>) => {
    if (!e.target.name) return
    console.info('BLUR: ', e.target.name)
    this.touched[e.target.name] = true
  }

  subscribe = (nameSubscriptions: string[], listener: Listener) => {
    nameSubscriptions.forEach((name) => {
      const listeners = this.listeners.get(name) || []
      listeners.push(listener)
      this.listeners.set(name, listeners)
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

  register = (name: string) => {
    const defaultValue = this.initialValues?.[name] ?? undefined
    const key = defaultValue?.toString()
    return defaultValue ? {key, name, defaultValue} : {name}
  }
}
