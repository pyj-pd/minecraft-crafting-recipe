import { ItemId } from '@shared/types/minecraft'
import { getPureItemName } from '@shared/utils/string'

export function getItemImageUrl(itemId: ItemId): string {
  const pureItemId = getPureItemName(itemId)

  return `/assets/data/renders/${pureItemId}.png`
}
