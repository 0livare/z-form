export type Nullable<T> = T | null | undefined

/** Allow IDE auto-completion of a few known values, while still allowing unknown values to be passed */
export type LooseAutoComplete<
  K extends string | number | symbol,
  Base = string,
> = K | Omit<Base, K>

/**
 * Simplify the TS "hover preview" for some of our custom types
 * e.g. `Prettify<{a: string} & {b: string} & {c?: string}>` becomes `{a: string; b: string; c?: string}`
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
