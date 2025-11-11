<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipe'
import { getItemImageUrl } from '@/utils/image'
import { ITEM_TAG_PREFIX, ItemId, ItemTag } from '@shared/types/minecraft'
import { storeToRefs } from 'pinia'

const { itemId, currentRecipeData } = storeToRefs(useRecipeStore())

const getPatternItemImage = (patternIndex: number): string | null => {
  if (currentRecipeData.value === null) return null

  let recipeItem: ItemId | ItemTag | null = null
  if (patternIndex >= 9)
    // Result item
    recipeItem = currentRecipeData.value.itemId
  else {
    // Ingredient items
    /** @todo support tags */
    const recipe = currentRecipeData.value.recipe

    if ('grid' in recipe) {
      // Shaped recipe
      const rowIndex = Math.floor(patternIndex / 3)
      const columnIndex = patternIndex - rowIndex * 3

      // @ts-expect-error The rows shouldn't be undefined.
      const gridItemId = recipe.grid[rowIndex][columnIndex]
      recipeItem = gridItemId ?? null
    } else if ('items' in recipe) {
      // Shapeless recipe
      const shapelessItemId = recipe.items[patternIndex]
      if (shapelessItemId) recipeItem = shapelessItemId
    }
  }

  if (recipeItem === null) return null

  let itemId: ItemId | null = null

  // Handle item tags
  if (recipeItem.startsWith(ITEM_TAG_PREFIX)) {
    const tagItemId = currentRecipeData.value.tags?.[recipeItem as ItemTag]?.[0]
    if (tagItemId) itemId = tagItemId
  } else itemId = recipeItem as ItemId

  if (itemId === null) return null
  else return getItemImageUrl(itemId)
}
</script>

<template>
  <svg
    :class="$style['crafting-table']"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    fill="none"
    viewBox="0 0 897 473"
  >
    <g clip-path="url(#clip0_1_16)">
      <path
        fill="#171615"
        d="M0 0h897v473H0z"
      />
      <mask
        id="path-3-outside-1_1_16"
        width="71"
        height="71"
        x="-2"
        y="-2"
        fill="#000"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#fff"
          d="M-2-2h71v71H-2z"
        />
        <path d="M22.333 67H0V0h67v22.333H44.667v22.334H22.333V67Z" />
      </mask>
      <path
        fill="#2F2A20"
        d="M22.333 67H0V0h67v22.333H44.667v22.334H22.333V67Z"
      />
      <path
        fill="#000"
        d="M22.333 67v2h2v-2h-2ZM0 67h-2v2h2v-2ZM0 0v-2h-2v2h2Zm67 0h2v-2h-2v2Zm0 22.333v2h2v-2h-2Zm-22.333 0v-2h-2v2h2Zm0 22.334v2h2v-2h-2Zm-22.334 0v-2h-2v2h2Zm0 22.333v-2H0v4h22.333v-2ZM0 67h2V0h-4v67h2ZM0 0v2h67v-4H0v2Zm67 0h-2v22.333h4V0h-2Zm0 22.333v-2H44.667v4H67v-2Zm-22.333 0h-2v22.334h4V22.333h-2Zm0 22.334v-2H22.333v4h22.334v-2Zm-22.334 0h-2V67h4V44.667h-2Z"
        mask="url(#path-3-outside-1_1_16)"
      />
      <mask
        id="path-5-outside-2_1_16"
        width="71"
        height="71"
        x="-2"
        y="406"
        fill="#000"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#fff"
          d="M-2 406h71v71H-2z"
        />
        <path d="M22.333 408H0v67h67v-22.333H44.667v-22.334H22.333V408Z" />
      </mask>
      <path
        fill="#2F2A20"
        d="M22.333 408H0v67h67v-22.333H44.667v-22.334H22.333V408Z"
      />
      <path
        fill="#000"
        d="M22.333 408v-2h2v2h-2ZM0 408h-2v-2h2v2Zm0 67v2h-2v-2h2Zm67 0h2v2h-2v-2Zm0-22.333v-2h2v2h-2Zm-22.333 0v2h-2v-2h2Zm0-22.334v-2h2v2h-2Zm-22.334 0v2h-2v-2h2Zm0-22.333v2H0v-4h22.333v2ZM0 408h2v67h-4v-67h2Zm0 67v-2h67v4H0v-2Zm67 0h-2v-22.333h4V475h-2Zm0-22.333v2H44.667v-4H67v2Zm-22.333 0h-2v-22.334h4v22.334h-2Zm0-22.334v2H22.333v-4h22.334v2Zm-22.334 0h-2V408h4v22.333h-2Z"
        mask="url(#path-5-outside-2_1_16)"
      />
      <mask
        id="path-7-outside-3_1_16"
        width="71"
        height="71"
        x="828"
        y="-2"
        fill="#000"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#fff"
          d="M828-2h71v71h-71z"
        />
        <path d="M874.667 67H897V0h-67v22.333h22.333v22.334h22.334V67Z" />
      </mask>
      <path
        fill="#2F2A20"
        d="M874.667 67H897V0h-67v22.333h22.333v22.334h22.334V67Z"
      />
      <path
        fill="#000"
        d="M874.667 67v2h-2v-2h2ZM897 67h2v2h-2v-2Zm0-67v-2h2v2h-2Zm-67 0h-2v-2h2v2Zm0 22.333v2h-2v-2h2Zm22.333 0v-2h2v2h-2Zm0 22.334v2h-2v-2h2Zm22.334 0v-2h2v2h-2Zm0 22.333v-2H897v4h-22.333v-2ZM897 67h-2V0h4v67h-2Zm0-67v2h-67v-4h67v2Zm-67 0h2v22.333h-4V0h2Zm0 22.333v-2h22.333v4H830v-2Zm22.333 0h2v22.334h-4V22.333h2Zm0 22.334v-2h22.334v4h-22.334v-2Zm22.334 0h2V67h-4V44.667h2Z"
        mask="url(#path-7-outside-3_1_16)"
      />
      <mask
        id="path-9-outside-4_1_16"
        width="71"
        height="71"
        x="828"
        y="406"
        fill="#000"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#fff"
          d="M828 406h71v71h-71z"
        />
        <path d="M874.667 408H897v67h-67v-22.333h22.333v-22.334h22.334V408Z" />
      </mask>
      <path
        fill="#2F2A20"
        d="M874.667 408H897v67h-67v-22.333h22.333v-22.334h22.334V408Z"
      />
      <path
        fill="#000"
        d="M874.667 408v-2h-2v2h2ZM897 408h2v-2h-2v2Zm0 67v2h2v-2h-2Zm-67 0h-2v2h2v-2Zm0-22.333v-2h-2v2h2Zm22.333 0v2h2v-2h-2Zm0-22.334v-2h-2v2h2Zm22.334 0v2h2v-2h-2Zm0-22.333v2H897v-4h-22.333v2ZM897 408h-2v67h4v-67h-2Zm0 67v-2h-67v4h67v-2Zm-67 0h2v-22.333h-4V475h2Zm0-22.333v2h22.333v-4H830v2Zm22.333 0h2v-22.334h-4v22.334h2Zm0-22.334v2h22.334v-4h-22.334v2Zm22.334 0h2V408h-4v22.333h2Z"
        mask="url(#path-9-outside-4_1_16)"
      />
      <path
        fill="#000"
        d="M215 112h250v250H215z"
      />
      <mask
        id="path-11-inside-5_1_16"
        fill="#fff"
      >
        <path d="M217 114h80.667v80.667H217V114Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M217 114h80.667v80.667H217V114Z"
      />
      <path
        fill="#282828"
        d="M217 114v-3h-3v3h3Zm0 0v3h80.667v-6H217v3Zm0 80.667h3V114h-6v80.667h3Z"
        mask="url(#path-11-inside-5_1_16)"
      />
      <path
        fill="url(#pattern0_1_16)"
        d="M229.833 126.833h55v55h-55z"
      />
      <mask
        id="path-14-inside-6_1_16"
        fill="#fff"
      >
        <path d="M299.667 114h80.666v80.667h-80.666V114Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M299.667 114h80.666v80.667h-80.666V114Z"
      />
      <path
        fill="#282828"
        d="M299.667 114v-3h-3v3h3Zm0 0v3h80.666v-6h-80.666v3Zm0 80.667h3V114h-6v80.667h3Z"
        mask="url(#path-14-inside-6_1_16)"
      />
      <path
        fill="url(#pattern1_1_16)"
        d="M312.5 126.833h55v55h-55z"
      />
      <mask
        id="path-17-inside-7_1_16"
        fill="#fff"
      >
        <path d="M382.333 114H463v80.667h-80.667V114Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M382.333 114H463v80.667h-80.667V114Z"
      />
      <path
        fill="#282828"
        d="M382.333 114v-3h-3v3h3Zm0 0v3H463v-6h-80.667v3Zm0 80.667h3V114h-6v80.667h3Z"
        mask="url(#path-17-inside-7_1_16)"
      />
      <path
        fill="url(#pattern2_1_16)"
        d="M395.167 126.833h55v55h-55z"
      />
      <mask
        id="path-20-inside-8_1_16"
        fill="#fff"
      >
        <path d="M217 196.667h80.667v80.666H217v-80.666Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M217 196.667h80.667v80.666H217v-80.666Z"
      />
      <path
        fill="#282828"
        d="M217 196.667v-3h-3v3h3Zm0 0v3h80.667v-6H217v3Zm0 80.666h3v-80.666h-6v80.666h3Z"
        mask="url(#path-20-inside-8_1_16)"
      />
      <path
        fill="url(#pattern3_1_16)"
        d="M229.833 209.5h55v55h-55z"
      />
      <mask
        id="path-23-inside-9_1_16"
        fill="#fff"
      >
        <path d="M299.667 196.667h80.666v80.666h-80.666v-80.666Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M299.667 196.667h80.666v80.666h-80.666v-80.666Z"
      />
      <path
        fill="#282828"
        d="M299.667 196.667v-3h-3v3h3Zm0 0v3h80.666v-6h-80.666v3Zm0 80.666h3v-80.666h-6v80.666h3Z"
        mask="url(#path-23-inside-9_1_16)"
      />
      <path
        fill="url(#pattern4_1_16)"
        d="M312.5 209.5h55v55h-55z"
      />
      <mask
        id="path-26-inside-10_1_16"
        fill="#fff"
      >
        <path d="M382.333 196.667H463v80.666h-80.667v-80.666Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M382.333 196.667H463v80.666h-80.667v-80.666Z"
      />
      <path
        fill="#282828"
        d="M382.333 196.667v-3h-3v3h3Zm0 0v3H463v-6h-80.667v3Zm0 80.666h3v-80.666h-6v80.666h3Z"
        mask="url(#path-26-inside-10_1_16)"
      />
      <path
        fill="url(#pattern5_1_16)"
        d="M395.167 209.5h55v55h-55z"
      />
      <mask
        id="path-29-inside-11_1_16"
        fill="#fff"
      >
        <path d="M217 279.333h80.667V360H217v-80.667Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M217 279.333h80.667V360H217v-80.667Z"
      />
      <path
        fill="#282828"
        d="M217 279.333v-3h-3v3h3Zm0 0v3h80.667v-6H217v3ZM217 360h3v-80.667h-6V360h3Z"
        mask="url(#path-29-inside-11_1_16)"
      />
      <path
        fill="url(#pattern6_1_16)"
        d="M229.833 292.167h55v55h-55z"
      />
      <mask
        id="path-32-inside-12_1_16"
        fill="#fff"
      >
        <path d="M299.667 279.333h80.666V360h-80.666v-80.667Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M299.667 279.333h80.666V360h-80.666v-80.667Z"
      />
      <path
        fill="#282828"
        d="M299.667 279.333v-3h-3v3h3Zm0 0v3h80.666v-6h-80.666v3Zm0 80.667h3v-80.667h-6V360h3Z"
        mask="url(#path-32-inside-12_1_16)"
      />
      <path
        fill="url(#pattern7_1_16)"
        d="M312.5 292.167h55v55h-55z"
      />
      <mask
        id="path-35-inside-13_1_16"
        fill="#fff"
      >
        <path d="M382.333 279.333H463V360h-80.667v-80.667Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M382.333 279.333H463V360h-80.667v-80.667Z"
      />
      <path
        fill="#282828"
        d="M382.333 279.333v-3h-3v3h3Zm0 0v3H463v-6h-80.667v3Zm0 80.667h3v-80.667h-6V360h3Z"
        mask="url(#path-35-inside-13_1_16)"
      />
      <path
        fill="url(#pattern8_1_16)"
        d="M395.167 292.167h55v55h-55z"
      />
      <path
        fill="#535353"
        d="M508 234.944h37v4.111h-37zM536.778 230.833h4.111v4.111h-4.111zM532.667 226.722h4.111v4.111h-4.111zM532.667 247.278h-4.111v4.111h4.111zM528.556 222.611h4.111v4.111h-4.111zM536.778 243.167h-4.111v4.111h4.111zM540.889 239.056h-4.111v4.111h4.111z"
      />
      <path
        stroke="#000"
        stroke-width="2"
        d="M587 188.5h97v97h-97z"
      />
      <mask
        id="path-46-inside-14_1_16"
        fill="#fff"
      >
        <path d="M588 189.5h95v95h-95v-95Z" />
      </mask>
      <path
        fill="#1D1D1D"
        d="M588 189.5h95v95h-95v-95Z"
      />
      <path
        fill="#282828"
        d="M588 189.5v-3h-3v3h3Zm0 0v3h95v-6h-95v3Zm0 95h3v-95h-6v95h3Z"
        mask="url(#path-46-inside-14_1_16)"
      />
      <path
        fill="url(#pattern9_1_16)"
        d="M608 209.5h55v55h-55z"
      />
    </g>
    <path
      stroke="#000"
      stroke-width="2"
      d="M1 1h895v471H1z"
    />
    <defs>
      <!-- Item grid images -->
      <pattern
        v-for="(_, i) in 10"
        :id="`pattern${i}_1_16`"
        :key="`${i},${itemId}`"
        width="1"
        height="1"
        patternContentUnits="objectBoundingBox"
      >
        <image
          :xlink:href="getPatternItemImage(i) ?? ''"
          transform="scale(.00781)"
          width="128"
          height="128"
          preserveAspectRatio="none"
        />
      </pattern>
      <clipPath id="clip0_1_16">
        <path
          fill="#fff"
          d="M0 0h897v473H0z"
        />
      </clipPath>
      <image
        id="image0_1_16"
        xlink:href=""
        width="128"
        height="128"
        preserveAspectRatio="none"
      />
    </defs>
  </svg>
</template>

<style lang="scss" module>
.crafting-table {
  width: 100%;
  max-width: 900px;
}
</style>
