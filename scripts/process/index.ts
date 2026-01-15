import { processRawLanguageData } from './process-language'
import { processRawRecipeData } from './process-recipe'
import { processRawRenderImages } from './process-renders'

await processRawRecipeData()
await processRawLanguageData()
await processRawRenderImages()
