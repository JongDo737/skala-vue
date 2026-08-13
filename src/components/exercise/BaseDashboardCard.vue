<template>
  <!--
    [slot] : 검색박스 / 리스트박스 공통 카드 틀
    부모가 SearchBar, WeatherCard 등을 이 안에 주입한다.
    Slot으로 넣은 자식은 시각적으로 이 카드 안에 있지만,
    스크립트는 부모(WeatherParent) 스코프에서 평가되어 props/emits로 직접 통신한다.
  -->
  <section class="base-dashboard-card">
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
