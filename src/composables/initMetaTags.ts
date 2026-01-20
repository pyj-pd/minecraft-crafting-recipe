import {
  DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  TITLE_SEPARATOR,
} from '@/constants/project'
import { useRecipeStore } from '@/stores/recipe'
import { useSearchStore } from '@/stores/search'
import { useHead, useSeoMeta } from '@unhead/vue'
import { storeToRefs } from 'pinia'

export const initMetaTags = (): void => {
  const { itemId } = storeToRefs(useRecipeStore())
  const { translationData } = storeToRefs(useSearchStore())

  const getTitle = (): string => {
    if (itemId.value === null || translationData.value === null)
      return DEFAULT_TITLE

    const itemName = translationData.value.translations[itemId.value]
    if (typeof itemName !== 'string') return DEFAULT_TITLE

    return `${itemName}${TITLE_SEPARATOR}${SITE_NAME}`
  }

  useSeoMeta({
    // General
    title: getTitle,
    description: SITE_DESCRIPTION,

    // Open Graph
    ogSiteName: SITE_NAME,
    ogTitle: SITE_NAME,
    ogDescription: SITE_DESCRIPTION,
  })

  useHead({
    link: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `${import.meta.env.BASE_URL}favicon.svg`,
      },
    ],
  })
}
