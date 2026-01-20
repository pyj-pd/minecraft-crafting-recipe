import { ItemId } from '@shared/types/minecraft'
import { getPureItemName } from '@shared/utils/string'

export function getItemImageUrl(itemId: ItemId): string {
  const pureItemId = getPureItemName(itemId)

  return `${import.meta.env.BASE_URL}assets/data/renders/${pureItemId}.webp`
}

const preloadImage = (url: string): Promise<void> =>
  new Promise((resolve) => {
    const image = new Image()
    image.src = url
    image.onload = (): void => resolve()
  })

export async function preloadItemImages(itemIds: ItemId[]): Promise<void> {
  for (const itemId of itemIds) {
    try {
      await preloadImage(getItemImageUrl(itemId))
    } catch {
      console.error(`Failed to preload item image of '${itemId}'.`)
    }
  }
}
