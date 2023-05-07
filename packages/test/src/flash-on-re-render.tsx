import React from 'react'

export function FlashOnReRender() {
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return

    root.style.backgroundColor = 'rgba(0, 0, 255, 0.25)'
    const timeoutId = setTimeout(() => {
      root.style.backgroundColor = 'transparent'
    }, 100)
    return () => clearTimeout(timeoutId)
  })

  return (
    <div
      ref={rootRef}
      className="absolute top-0 left-0 right-0 bottom-0 w-full h-full transition-colors pointer-events-none"
    />
  )
}
