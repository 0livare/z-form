export type ValidationAdapter = (
  validationSchema: any,
  value: unknown,
) => null | Record<string, string>
