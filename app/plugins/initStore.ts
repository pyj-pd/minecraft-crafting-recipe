export default defineNuxtPlugin(async () => {
  const searchStore = useSearchStore()

  await searchStore._fetchInitialData()
})
