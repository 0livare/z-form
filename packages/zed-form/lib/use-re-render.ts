import React from 'react'

/**
 * A simple hook to force trigger a React re-render
 */
export function useReRender() {
  const [, setCount] = React.useState(0)
  const reRender = React.useCallback(() => {
    setCount((c) => c + 1)
  }, [])
  return reRender
}
