import { minecraftPrefix } from '../constants/minecraft'
import { ItemId } from '../types/minecraft'

/**
 * Removes `minecraft:` prefix from item id.
 */
export function getPureItemName(itemId: ItemId): string {
  const index = itemId.indexOf(minecraftPrefix)

  if (index < 0) return itemId
  else return itemId.substring(index + minecraftPrefix.length)
}
