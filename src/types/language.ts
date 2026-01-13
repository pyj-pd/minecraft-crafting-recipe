import { languageList } from '@/constants/language'
import z from 'zod'

export const LanguageId = z.enum(
  languageList.map((language) => language.languageId)
)
export type LanguageId = z.infer<typeof LanguageId>
