<script lang="ts" setup>
import Editor from '@/components/ui/editor/text-editor.vue'
import { EditorType } from '@/types/card-type'
import type { tagType } from '@/types/memo'
const tagList = [{
  id: 1,
  content: '123',
  name: '123',
},
{
  id: 1,
  content: '223',
  name: '333',
}] as unknown as tagType[]
</script>

<template>
  <div class="h-full w-full">
    <div class="flex absolute top-1/2 left-1/2">
      <Editor
        :suggestion-list="tagList"
        :type="EditorType.create"
      />
    </div>
  </div>
</template>

<style lang="">

</style>
