<!--
  ============================================================================
  BaseDashboardCard.vue — 대시보드 공통 카드 틀
  ============================================================================

  [역할]
  검색 영역·목록 영역에 공통으로 쓰는 카드 UI(제목 + 본문)를 제공한다.

  [동작 방식]
  - named slot `#title` 로 제목, default slot 으로 본문 내용을 부모가 주입한다.
  - `$slots.title` 이 있을 때만 header를 렌더한다.

  [분리한 이유]
  검색 박스와 리스트 박스의 바깥 틀(배경·패딩·테두리)을 한곳에서 맞춰
  WeatherParent 템플릿을 단순하게 유지한다.

-->
<template>
  <section class="base-dashboard-card">
    <!-- v-if + $slots: 부모가 #title 을 넘겼을 때만 헤더 표시 -->
    <header v-if="$slots.title" class="card-title">
      <slot name="title"></slot>
    </header>
    <div class="card-body">
      <slot></slot>
    </div>
  </section>
</template>

<style scoped>
.base-dashboard-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}

.card-title {
  margin-bottom: 8px;
}

.card-title :deep(h3) {
  margin: 0 0 8px;
  font-size: 16px;
}

.card-body {
  width: 100%;
}
</style>
