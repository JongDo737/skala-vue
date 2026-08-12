<!-- [icon] : 날씨 카드용 SVG. 태양/구름/비 도형, 상위 .container.{type} 클래스로 스타일 변경 -->
<template>
  <svg class="weather-card-svg" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
    <circle class="weather-sun" cx="150" cy="210" r="50" />

    <g class="weather-cloud weather-cloud-3">
      <ellipse cx="70" cy="145" rx="48" ry="22" />
      <ellipse cx="110" cy="138" rx="36" ry="20" />
      <ellipse cx="40" cy="140" rx="28" ry="16" />
    </g>

    <g class="weather-cloud weather-cloud-2">
      <ellipse cx="190" cy="120" rx="52" ry="24" />
      <ellipse cx="230" cy="112" rx="38" ry="20" />
      <ellipse cx="155" cy="118" rx="30" ry="16" />
    </g>

    <g class="weather-cloud weather-cloud-1">
      <ellipse cx="120" cy="95" rx="56" ry="24" />
      <ellipse cx="165" cy="88" rx="40" ry="20" />
      <ellipse cx="85" cy="92" rx="32" ry="16" />
    </g>

    <g class="weather-rain-lines">
      <line x1="70" y1="160" x2="55" y2="210" />
      <line x1="120" y1="155" x2="105" y2="205" />
      <line x1="170" y1="160" x2="155" y2="210" />
      <line x1="210" y1="150" x2="195" y2="200" />
      <line x1="250" y1="158" x2="235" y2="208" />
    </g>
  </svg>
</template>
