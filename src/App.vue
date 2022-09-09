<script setup lang="ts">
import { ElLoading, ElConfigProvider } from "element-plus";
const loadingInstance = ElLoading.service({
  background: "rgba(0, 0, 0, 0.1)",
});
const resolve = () => {
  loadingInstance.close();
};
</script>
<template>
  <main class="h-screen">
    <ElConfigProvider>
      <suspense @resolve="resolve">
        <template #default>
          <router-view #default="{ Component }">
            <component :is="Component" />
          </router-view>
        </template>
        <template #fallback> loading... </template>
      </suspense>
    </ElConfigProvider>
  </main>
</template>
