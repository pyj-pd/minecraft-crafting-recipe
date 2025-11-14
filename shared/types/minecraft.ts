import * as z from 'zod'
import { minecraftPrefix } from '../constants/minecraft'

// Strings
export const MinecraftPrefix = z.literal(minecraftPrefix)

export const ItemId = z.templateLiteral([MinecraftPrefix, z.string()])
export type ItemId = z.infer<typeof ItemId>

export const ITEM_TAG_PREFIX = '#'

export const ItemTag = z.templateLiteral([
  ITEM_TAG_PREFIX,
  MinecraftPrefix,
  z.string(),
])
export type ItemTag = z.infer<typeof ItemTag>

export const ItemIdOrTag = z.union([ItemId, ItemTag])

export const PossibleItem = z.union([ItemId, z.array(ItemId)])
export type PossibleItem = z.infer<typeof PossibleItem>
