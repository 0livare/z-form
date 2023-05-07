import React from 'react'
import {Form, useCreateForm, useFormListener} from 'z-form'

import './app.css'

export default function App() {
  const [, setCount] = React.useState(0)
  const [initialValues, setInitialValues] = React.useState({
    foo: null as string | null,
  })

  React.useEffect(() => {
    setTimeout(() => setInitialValues({foo: 'foo'}), 1000)
  }, [])

  console.log('initialValues', initialValues)

  const form = useCreateForm({initialValues})

  return (
    <Form
      form={form}
      className="flex h-full items-center justify-center flex-col gap-4"
    >
      <input type="text" {...form.register('foo')} />
      <input type="text" {...form.register('bar')} />

      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Re-Render
      </button>
    </Form>
  )
}
