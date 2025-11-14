import * as z from 'zod'
import { ItemId, ItemIdOrTag, ItemTag } from './minecraft'

export const RawTagFile = z.object({
  values: z.array(ItemIdOrTag),
})
export type RawTagFile = z.infer<typeof RawTagFile>

export const TagsData = z.record(ItemTag, z.array(ItemId))
export type TagsData = z.infer<typeof TagsData>
