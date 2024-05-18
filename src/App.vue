<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useDark } from '@vueuse/core'
useDark()
</script>

<template>
  <main class="h-screen">
    <ElConfigProvider>
      <suspense>
        <template #default>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </template>
        <template #fallback>
          loading...
        </template>
      </suspense>
    </ElConfigProvider>
  </main>
</template>
