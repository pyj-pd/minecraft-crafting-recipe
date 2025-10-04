import * as z from 'zod'
import { ItemId } from './minecraft'

export const RawLanguageFile = z.record(z.string(), z.string())
export type RawLanguageFile = z.infer<typeof RawLanguageFile>

export const LanguageData = z.object({
  languageId: z.string(),
  translations: z.record(ItemId, z.string()),
})
export type LanguageData = z.infer<typeof LanguageData>
