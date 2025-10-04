import * as z from 'zod'

// Strings
export const minecraftPrefix = 'minecraft'
export const MinecraftPrefix = z.literal(minecraftPrefix)

export const ItemId = z.templateLiteral([MinecraftPrefix, ':', z.string()])

export const ITEM_TAG_PREFIX = '#'

export const ItemTag = z.templateLiteral([
  ITEM_TAG_PREFIX,
  MinecraftPrefix,
  ':',
  z.string(),
])
