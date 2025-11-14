import * as z from 'zod'
import { ItemId, ItemIdOrTag } from '../minecraft'
import {
  SHAPED_RECIPE_TAG,
  SHAPELESS_RECIPE_TAG,
} from '../../constants/minecraft'

const RawRecipeDataCommon = z.object({
  category: z.string(),
  result: z.object({
    count: z.number().optional(),
    id: ItemId,
  }),
})

export const RawPossibleItem = z.union([ItemIdOrTag, z.array(ItemIdOrTag)])
export type RawPossibleItem = z.infer<typeof RawPossibleItem>

// Shaped recipe
export const RawShapedRecipeType = z.literal(SHAPED_RECIPE_TAG)

export const RawShapedRecipeData = RawRecipeDataCommon.extend({
  type: RawShapedRecipeType,
  key: z.record(z.string(), RawPossibleItem),
  pattern: z.array(z.string()),
})

export type RawShapedRecipeData = z.infer<typeof RawShapedRecipeData>

// Shapeless recipe
export const RawShapelessRecipeType = z.literal(SHAPELESS_RECIPE_TAG)

export const RawShapelessRecipeData = RawRecipeDataCommon.extend({
  type: RawShapelessRecipeType,
  ingredients: z.array(RawPossibleItem),
})

export type RawShapelessRecipeData = z.infer<typeof RawShapelessRecipeData>

// Recipe data
export const RawRecipeData = z.union([
  RawShapedRecipeData,
  RawShapelessRecipeData,
])
export type RawRecipeData = z.infer<typeof RawRecipeData>
