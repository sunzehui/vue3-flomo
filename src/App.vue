<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useColorMode } from '@vueuse/core'
// 支持 跟随系统 / 浅色 / 深色 三种模式，持久化到 localStorage
useColorMode({ emitAuto: true })
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
