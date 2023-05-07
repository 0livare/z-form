import React from 'react'
import {Form, useCreateForm, useFormValue} from 'z-form'
import {FlashOnReRender} from './flash-on-re-render'

import './app.css'

type FormShape = {
  foo: string
  bar: string
}

export default function App() {
  const [, setCount] = React.useState(0)

  const form = useCreateForm({
    initialValues: {foo: 'foo'},
  })

  const submitCount = useFormValue<FormShape>('submitCount', form)
  console.log('submitCount', submitCount)

  return (
    <Form
      form={form}
      className="flex h-full items-center justify-center flex-col gap-4 relative"
    >
      <TextField type="text" {...form.register('foo')} />
      <TextField type="text" {...form.register('bar')} />

      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Re-Render
      </button>

      <button type="submit">Submit</button>

      <FlashOnReRender />
    </Form>
  )
}

function TextField(props: React.ComponentProps<'input'>) {
  return (
    <div className="relative">
      <input {...props} />
      <FlashOnReRender />
    </div>
  )
}
