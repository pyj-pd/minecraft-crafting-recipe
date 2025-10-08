import * as z from 'zod'
import { ItemId, ItemTag } from '@shared/types/minecraft'

export const RawTagFile = z.object({
  values: z.array(z.union([ItemId, ItemTag])),
})
export type RawTagFile = z.infer<typeof RawTagFile>

export const TagsData = z.record(ItemTag, z.array(ItemId))
export type TagsData = z.infer<typeof TagsData>
