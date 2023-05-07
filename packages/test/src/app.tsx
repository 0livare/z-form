import React from 'react'
import {Form, useCreateForm, useFormListener} from 'z-form'

import './app.css'

export default function App() {
  const [, setCount] = React.useState(0)

  const form = useCreateForm()
  const foo = useFormListener('foo', form)
  console.log('foo', foo)

  return (
    <Form
      form={form}
      className="flex h-full items-center justify-center flex-col gap-4"
    >
      <input type="text" name="foo" />
      <input type="text" name="bar" />

      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Re-Render
      </button>
    </Form>
  )
}
