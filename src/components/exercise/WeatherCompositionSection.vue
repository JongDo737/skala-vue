<script setup>
/*
  ============================================================================
  WeatherCompositionSection.vue — Composition 공통 섹션 카드
  ============================================================================

  [역할]
  검색/목록 영역을 감싸는 공통 섹션(제목 + 본문 slot)을 제공한다.

  [동작 방식]
  - props.title 또는 #title slot 으로 제목 표시
  - default slot 으로 본문(검색바·카드 등)을 부모가 주입

  [분리한 이유]
  WeatherComposition 안의 여러 패널 틀을 맞춰
  레이아웃 CSS와 내용 컴포넌트를 나누기 위함이다.

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
    <!-- title prop 또는 #title slot 이 있을 때만 헤더 -->
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
