<script lang="ts" setup>
import { Refresh, Search } from "@element-plus/icons";
import { reactive } from "vue";
import Editer from "../components/Editer.vue";
import MemoCard from "../components/MemoCard.vue";
const memoList = reactive([]);
</script>

<template>
  <div class="memo-view">
    <nav>
      <span>
        MEMO
        <i>
          <Refresh />
        </i>
      </span>
      <div class="input-wrapper">
        <input type="text" />
        <i><Search /></i>
      </div>
    </nav>
    <Editer :tags="[]" :save="(v) => Promise.resolve(true)" />
    <ul class="card-container">
      <template v-for="memo of memoList">
        <MemoCard :article="memo" />
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
i {
  font-style: normal;
}
svg {
  display: inline;
}

nav {
  display: flex;
  padding: 10px 0 10px 0;
  line-height: 40px;
  span > label {
    font-size: 18px;
    font-weight: bold;
    color: #5f5f5f;
  }
  span {
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    color: #5f5f5f;
    @apply relative;
    svg {
      height: 14px;
      width: 14px;
    }
  }
  .input-wrapper {
    position: relative;
    font-size: 14px;
    box-sizing: border-box;
    i {
      @apply absolute top-0 left-[5px];

      height: 40px;
      width: 25px;
      text-align: center;
      transition: all 0.3s;
      line-height: 40px;
      svg {
        height: 14px;
        width: 14px;
      }
    }
  }
  input {
    height: 40px;
    outline: 0;
    border: none;
    background: #efefef;
    border-radius: 8px;
    padding: 0 30px;
    &:focus,
    &:active {
      outline: 0;
      box-shadow: none;
    }
  }
}

.card-container {
}
</style>
