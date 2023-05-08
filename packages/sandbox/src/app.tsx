import React from 'react'
import {Form, useCreateForm, useFormValue} from '../../zed-form/dist'
import zod from 'zod'

import {FlashOnReRender} from './flash-on-re-render'

import './app.css'

type FormShape = {
  foo: string
  bar: string
}

const schema = zod.object({
  foo: zod.enum(['foo', 'baz']),
})

export default function App() {
  const [, setCount] = React.useState(0)

  const {form, register} = useCreateForm({
    initialValues: {foo: 'foo'},
    validationSchema: schema,
  })

  return (
    <Form
      form={form}
      className="flex h-full items-center justify-center flex-col gap-4 relative"
    >
      <TextField type="text" {...register('foo')} />
      <TextField type="text" {...register('bar')} />

      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Re-Render
      </button>

      <button type="submit">Submit</button>

      <FlashOnReRender />
    </Form>
  )
}

function TextField(props: React.ComponentProps<'input'>) {
  const error = useFormValue(`error:${props.name}`)

  return (
    <div className="relative w-64">
      <input {...props} className="w-full" />
      {error && <p className="text-red-500 text-sm max-w-full">{error}</p>}
      <FlashOnReRender />
    </div>
  )
}
