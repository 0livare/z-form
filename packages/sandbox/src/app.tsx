import React from 'react'
import {Form, useCreateForm, useFormValue, Field} from 'zed-form'
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
    initialValues: {
      foo: 'foo',
      number: 'two',
      vehicles: ['car'],
      acceptTerms: false,
      cars: '',
    },
    validationSchema: schema,
  })

  return (
    <Form
      form={form}
      className="flex h-full items-center justify-center flex-col gap-4 relative"
    >
      <TextField {...register({name: 'foo'})} />
      <TextField {...register({name: 'bar'})} />

      <fieldset className="flex flex-col p-4 border border-gray-300">
        <legend>Number</legend>
        <label>
          <Field type="radio" name="number" value="one" />
          One
        </label>
        <label>
          <input {...register({name: 'number', type: 'radio', value: 'two'})} />
          Two
        </label>
        <label>
          <input
            {...register({name: 'number', type: 'radio', value: 'three'})}
          />
          Three
        </label>
      </fieldset>

      <fieldset className="flex flex-col p-4 border border-gray-300">
        <legend>Vehicles I own</legend>
        <label>
          <Field type="checkbox" name="vehicles" value="bike" />
          <span className="ml-2">I have a bike</span>
        </label>
        <label>
          <input
            {...register({name: 'vehicles', type: 'checkbox', value: 'car'})}
          />
          <span className="ml-2">I have a car</span>
        </label>
        <label>
          <input
            {...register({name: 'vehicles', type: 'checkbox', value: 'boat'})}
          />
          <span className="ml-2">I have a boat</span>
        </label>
      </fieldset>

      <label>
        <input {...register({name: 'acceptTerms', type: 'checkbox'})} />I accept
        the terms and conditions
      </label>

      <label>
        Choose a car:
        <Field
          type="select"
          name="cars"
          className="border border-gray-300 ml-4"
        >
          <option value=""></option>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </Field>
      </label>

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
