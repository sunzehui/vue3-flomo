<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ref, unref } from 'vue'
import { useMemoStore } from '@/store/memo'
import type { ArticleSort } from '@/api/memo'

const { getMemoList } = useMemoStore()
const inputVal = ref('')
const showAdvanced = ref(false)

const filters = ref<{
  from: string
  to: string
  hasImage: boolean
  sort: ArticleSort
}>({
  from: '',
  to: '',
  hasImage: false,
  sort: 'time_desc',
})

const buildQuery = () => ({
  content: unref(inputVal) || undefined,
  from: filters.value.from || undefined,
  to: filters.value.to || undefined,
  hasImage: filters.value.hasImage || undefined,
  sort: filters.value.sort,
})

const onSearch = async () => {
  await getMemoList(buildQuery())
}

const onReset = async () => {
  inputVal.value = ''
  filters.value = { from: '', to: '', hasImage: false, sort: 'time_desc' }
  await getMemoList({})
}
</script>

<template>
  <div class="search-box">
    <div class="input-wrapper">
      <input
        v-model="inputVal"
        enterkeyhint="search"
        aria-placeholder="search memos..." placeholder="search memos..." type="text" @keyup.enter="onSearch"
      >
      <Search class="input-icon" @click="onSearch" />
      <span class="filter-toggle" @click="showAdvanced = !showAdvanced">
        {{ showAdvanced ? '收起' : '筛选' }}
      </span>
    </div>

    <div v-if="showAdvanced" class="filter-panel">
      <div class="filter-row">
        <label>时间范围</label>
        <input v-model="filters.from" type="date" class="date-input">
        <span class="sep">~</span>
        <input v-model="filters.to" type="date" class="date-input">
      </div>
      <div class="filter-row">
        <label>排序</label>
        <select v-model="filters.sort" class="select-input">
          <option value="time_desc">最新在前</option>
          <option value="time_asc">最早在前</option>
        </select>
        <label class="checkbox-label">
          <input v-model="filters.hasImage" type="checkbox">
          只看带图
        </label>
      </div>
      <div class="filter-row actions">
        <span class="link" @click="onSearch">应用</span>
        <span class="link" @click="onReset">重置</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  position: relative;
}
.input-wrapper {
  max-width: 200px;
  position: relative;
  box-sizing: border-box;

  input {
    width: 100%;
    font-size: 14px;
    height: 100%;
    outline: 0;
    border: none;
    @apply bg-dark-fill-2 ;
    border-radius: 8px;
    @apply pl-8 pr-12;

    &:focus,
    &:active {
      outline: 0;
      box-shadow: none;
    }
    &::placeholder {
      @apply text-placeholder ;
    }
  }

  .input-icon {
    @apply absolute top-1/2 -translate-y-1/2 left-[10px] h-4 w-4 cursor-pointer;
    text-align: center;
  }

  .filter-toggle {
    @apply absolute top-1/2 -translate-y-1/2 right-[8px] cursor-pointer;
    font-size: 11px;
    @apply text-regular-text;
  }
}
.filter-panel {
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 20;
  width: 280px;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  @apply bg-base-fill;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  label {
    @apply text-regular-text;
  }
  &.actions {
    justify-content: flex-end;
    margin-bottom: 0;
    gap: 12px;
  }
}
.date-input,
.select-input {
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  @apply bg-base-fill text-primary-text;
}
.sep {
  @apply text-regular-text;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
}
.link {
  cursor: pointer;
  @apply text-primary-light-2;
}
</style>
