import {
  DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TITLE_SEPARATOR,
} from '@/constants/project'
import { useRecipeStore } from '@/stores/recipe'
import { useSearchStore } from '@/stores/search'
import { useHead, useSeoMeta } from '@unhead/vue'
import { storeToRefs } from 'pinia'

const OG_IMAGE_URL = `${SITE_URL}favicon.svg`

export const initMetaTags = (): void => {
  const { itemId } = storeToRefs(useRecipeStore())
  const { translationData } = storeToRefs(useSearchStore())

  const getTitle = (): string => {
    if (itemId.value === null || translationData.value === null)
      return DEFAULT_TITLE

    const itemName = translationData.value.translations[itemId.value]
    if (typeof itemName !== 'string') return DEFAULT_TITLE

    return `${itemName}${TITLE_SEPARATOR}${DEFAULT_TITLE}`
  }

  useSeoMeta({
    // General
    title: getTitle,
    description: SITE_DESCRIPTION,

    // Open Graph
    ogSiteName: SITE_NAME,
    ogTitle: DEFAULT_TITLE,
    ogDescription: SITE_DESCRIPTION,
    ogUrl: SITE_URL,
    ogImage: OG_IMAGE_URL,
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }

  useHead({
    link: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `${import.meta.env.BASE_URL}favicon.svg`,
      },
      {
        rel: 'icon',
        href: `${import.meta.env.BASE_URL}favicon.ico`,
        sizes: 'any',
      },
      {
        rel: 'canonical',
        href: SITE_URL,
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd),
      },
    ],
  })
}
