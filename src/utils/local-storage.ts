import type { ZodType } from 'zod'

const LOCAL_STORAGE_DEBOUNCE_MS = 200

export class LocalStorageUtil<DataType> {
  storageKey: string
  zodType: ZodType<DataType>

  debounceTimeout: ReturnType<typeof setTimeout> | null = null
  useDebounce: boolean

  constructor(
    storageKey: string,
    zodType: ZodType<DataType>,
    useDebounce: boolean = true
  ) {
    this.storageKey = storageKey
    this.zodType = zodType

    this.useDebounce = useDebounce
  }

  getData(): DataType | null {
    const rawData = localStorage.getItem(this.storageKey)

    if (rawData === null) return null

    try {
      if (this.zodType.type === 'array' || this.zodType.type === 'object')
        return this.zodType.parse(JSON.parse(rawData))
      else return this.zodType.parse(rawData)
    } catch {
      return null
    }
  }

  setData(data: DataType): void {
    if (this.useDebounce && this.debounceTimeout !== null)
      clearTimeout(this.debounceTimeout)

    const executeSet = (): void => {
      this._setData(data)
      this.debounceTimeout = null
    }

    if (this.useDebounce)
      this.debounceTimeout = setTimeout(executeSet, LOCAL_STORAGE_DEBOUNCE_MS)
    else executeSet()
  }

  private _setData(data: DataType): void {
    if (this.zodType.type === 'array' || this.zodType.type === 'object')
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    else localStorage.setItem(this.storageKey, String(data))
  }

  removeData(): void {
    localStorage.removeItem(this.storageKey)
  }
}
