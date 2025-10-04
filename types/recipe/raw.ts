import * as z from 'zod'
import { ItemId, ItemTag } from '../minecraft'

const RawRecipeDataCommon = z.object({
  category: z.string(),
  result: z.object({
    count: z.number().optional(),
    id: ItemId,
  }),
})

// Shaped recipe
export const RawShapedRecipeType = z.literal('minecraft:crafting_shaped')

export const RawShapedRecipeData = RawRecipeDataCommon.extend({
  type: RawShapedRecipeType,
  key: z.record(z.string(), z.union([ItemId, ItemTag])),
  pattern: z.array(z.string()),
})

export type RawShapedRecipeData = z.infer<typeof RawShapedRecipeData>

// Shapeless recipe
export const RawShapelessRecipeType = z.literal('minecraft:crafting_shapeless')

export const RawShapelessRecipeData = RawRecipeDataCommon.extend({
  type: RawShapelessRecipeType,
  ingredients: z.array(z.union([ItemId, ItemTag])),
})

export type RawShapelessRecipeData = z.infer<typeof RawShapelessRecipeData>

// Recipe data
export const RawRecipeData = z.union([
  RawShapedRecipeData,
  RawShapelessRecipeData,
])

export type RawRecipeData = z.infer<typeof RawRecipeData>
