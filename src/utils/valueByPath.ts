export function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  if (!obj || !path) return undefined

  return path.split('.').reduce<unknown>((current, key) => {
    return (current as Record<string, unknown>)?.[key]
  }, obj)
}

export function setValueByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  if (!obj || !path) return obj

  const keys = path.split('.')
  const lastKey = keys.pop()!

  const parent = keys.reduce<Record<string, unknown>>((current, key, index) => {
    if (current[key] === null || current[key] === undefined) {
      const nextKey = keys[index + 1] || lastKey
      current[key] = /^\d+$/.test(nextKey) ? [] : {}
    }
    return current[key] as Record<string, unknown>
  }, obj)

  parent[lastKey] = value
  return obj
}
