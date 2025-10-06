<script setup lang="ts">
import { fuse } from '@/utils/search'

let resultIndexes: number[] = []

const onInput = (event:InputEvent) => {
    const query = (event.target as HTMLInputElement).value

    resultIndexes = fuse.search(query).map((result) => result.refIndex)
}
</script>

<template>
    <input type="search" @input="onInput"></input>
</template>