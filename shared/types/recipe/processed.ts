import * as z from 'zod'
import { ItemId, ItemTag, PossibleItem } from '../minecraft'

export const RecipeDataTagData = z.record(ItemTag, z.array(ItemId))
export type RecipeDataTagData = z.infer<typeof RecipeDataTagData>

const RecipeDataCommon = z.object({
  itemId: ItemId,
  count: z.number(),
})

// Shaped recipe
export const ShapedRecipeType = z.literal('shaped')

export const ShapedRecipeItem = z.union([z.null(), PossibleItem])

export const ShapedRecipeRow = z.tuple([
  ShapedRecipeItem,
  ShapedRecipeItem,
  ShapedRecipeItem,
])

export const ShapedRecipeGrid = z.tuple([
  ShapedRecipeRow,
  ShapedRecipeRow,
  ShapedRecipeRow,
])

export type ShapedRecipeGrid = z.infer<typeof ShapedRecipeGrid>

export const ShapedRecipe = RecipeDataCommon.extend({
  type: ShapedRecipeType,
  recipe: z.object({ grid: ShapedRecipeGrid }),
})

export type ShapedRecipe = z.infer<typeof ShapedRecipe>

// Shapeless recipe
export const ShapelessRecipeType = z.literal('shapeless')

export const ShapelessRecipe = RecipeDataCommon.extend({
  type: ShapelessRecipeType,
  recipe: z.object({ items: z.array(PossibleItem) }),
})

export type ShapelessRecipe = z.infer<typeof ShapelessRecipe>

// Recipe data
export const RecipeData = z.union([ShapedRecipe, ShapelessRecipe])
export type RecipeData = z.infer<typeof RecipeData>

export const RecipeFileData = z.array(RecipeData)
export type RecipeFileData = z.infer<typeof RecipeFileData>

// Recipe list data
export const RecipeListData = z.array(ItemId)
export type RecipeListData = z.infer<typeof RecipeListData>
