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
          <input {...register({name: 'number', type: 'radio', value: 'one'})} />
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
          <input
            {...register({name: 'vehicles', type: 'checkbox', value: 'bike'})}
          />
          I have a bike
        </label>
        <label>
          <input
            {...register({name: 'vehicles', type: 'checkbox', value: 'car'})}
          />
          I have a car
        </label>
        <label>
          <input
            {...register({name: 'vehicles', type: 'checkbox', value: 'boat'})}
          />
          I have a boat
        </label>
      </fieldset>

      <label>
        <input {...register({name: 'acceptTerms', type: 'checkbox'})} />I accept
        the terms and conditions
      </label>

      <label>
        Choose a car:
        <select
          {...register({name: 'cars'})}
          className="border border-gray-300 ml-4"
        >
          <option value=""></option>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
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
