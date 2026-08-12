<script setup>
/**
 * [UnitToggler] : Pinia configStore의 unit을 토글하는 UI
 *
 * [기존] 단위 UI가 없거나 각 화면에서 따로 관리할 수 있었음
 * [현재] 헤더(다크모드 옆)에서 configStore.toggleUnit() 호출
 *        → 메인 카드 / 상세 패널 displayTemp가 같이 바뀜
 */
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">
      날씨단위:
      <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong>
    </span>
    <button type="button" class="toggle-btn" @click="configStore.toggleUnit()">
      {{ configStore.unit === 'celsius' ? '화씨로' : '섭씨로' }}
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.unit-label {
  font-size: 12px;
  color: var(--app-muted, #7f8c8d);
  white-space: nowrap;
}

.unit-label strong {
  color: var(--app-text, #2c3e50);
}

.toggle-btn {
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid var(--app-btn-border, #dde2e8);
  background: var(--app-btn-bg, #fff);
  color: var(--app-text, #2c3e50);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.toggle-btn:hover {
  border-color: var(--app-nav-active, #3498db);
  color: var(--app-nav-active, #3498db);
}
</style>
