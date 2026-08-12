<script setup>
/**
 * [component] : Composition용 공통 섹션 카드
 * 검색/목록 영역을 slot으로 받아 부모(WeatherComposition)가 내용을 주입한다.
 * Slot 자식은 시각적으로 이 안에 있어도, 스크립트는 부모 스코프에서 props/emits 통신한다.
 */
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="wc-section">
    <header v-if="title || $slots.title" class="wc-section-title">
      <slot name="title">
        <h3 v-if="title">{{ title }}</h3>
      </slot>
    </header>
    <div class="wc-section-body">
      <slot></slot>
    </div>
  </section>
</template>

<style scoped>
.wc-section {
  width: 100%;
  background: var(--wc-panel-bg, rgba(255, 255, 255, 0.85));
  border: 1px solid var(--wc-border, rgba(0, 0, 0, 0.08));
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 0;
  box-sizing: border-box;
}

.wc-section-title h3 {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--wc-muted, #666);
}

.wc-section-body {
  width: 100%;
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
