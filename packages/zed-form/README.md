# Zed Form

A radically different, yet familiar, approach to forms in React: **just let the browser do it**

> _Zero re-renders by default_

<!-- A fast, scalable, easy to use, complete form solution for React. -->

## Why?

Perhaps the most frustrating part of React is dealing with forms. The [standard React approach](https://legacy.reactjs.org/docs/forms.html) to forms is both slow and filled with boilerplate. Some libraries deal with the boilerplate by adding complexity and are still slow.

Zed Form takes a radically different, yet familiar, approach to forms: **just let the browser do it**.

The eventing system that is already built into the browser is incredibly fast and efficient for dealing with form inputs. React layering a bunch of unnecessary rendering and re-rendering on top of that flow really slows down pages with many form elements as everything is re-rendered on every user keystroke.

With Zed Form, every `<input>` is an "uncontrolled" input. Instead of forcing the input to have a certain value, and re-rendering the input on every keystroke to force it to have an updated value, Zed Form _just let's the user type_ and keeps track of what they've typed.

On top of that, Zed Form supports all the features you've come to expect form other form libraries:

- Schema error validation
  - Built in support for [zod](https://github.com/colinhacks/zod) (but you can supply an adapter for any schema validation library
- Setting initial values
- "Touched" tracking, so errors by default aren't shown until the user has interacted with a particular input
- Opt-in support for tracking a form value via React state (useful for when you need to hide or show form inputs based on a previous input value)

## Install

```bash
npm i zed-form     # npm
pnpm i zed-form    # pnpm
yarn add zed-form  # yarn
```

## Example

```js
import {Form, useCreateForm} from 'zed-form'

function App() {
  const form = useCreateForm()
  return (
    <Form form={form}>
      <input type="text" {...form.register('foo')} />
      <input type="text" {...form.register('bar')} />
    </Form>
  )
}
```

## Example with Schema Validation

```js
import {Form, useCreateForm, useFormValue} from 'zed-form'
import zod from 'zod'

const schema = zod.object({
  foo: zod.enum(['foo', 'baz']),
})

function App() {
  const form = useCreateForm({
    initialValues: {foo: 'foo'},
    validationSchema: schema,
  })

  return (
    <Form form={form}>
      <TextField type="text" {...form.register('foo')} />
      <TextField type="text" {...form.register('bar')} />
    </Form>
  )
}

function TextField(props: React.ComponentProps<'input'>) {
  const error = useFormValue(`error:${props.name}`)

  return (
    <div>
      <input {...props} className="w-full" />
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  )
}
```
