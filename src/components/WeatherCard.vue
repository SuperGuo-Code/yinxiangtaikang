<template>
  <div class="weather-card">
    <div class="weather-left">
      <div class="weather-icon">{{ weatherIcon }}</div>
      <div class="weather-info">
        <div class="weather-temp">{{ temperature }}°C</div>
        <div class="weather-desc">{{ description }}</div>
      </div>
    </div>
    <div class="weather-right">
      <div class="weather-location">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        {{ location }}
      </div>
      <div class="weather-detail">
        <span>风力: {{ wind }}</span>
        <span>湿度: {{ humidity }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  location: { type: String, default: '河南周口太康' },
  temperature: { type: [String, Number], default: '25' },
  description: { type: String, default: '多云' },
  wind: { type: String, default: '东南风3级' },
  humidity: { type: [String, Number], default: '65' },
  weatherIcon: { type: String, default: '⛅' }
})
</script>

<style scoped>
.weather-card {
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-light) 100%);
  color: #fff;
  border-radius: var(--radius);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow);
}

.weather-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-icon {
  font-size: 48px;
  line-height: 1;
}

.weather-temp {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.1;
}

.weather-desc {
  font-size: 15px;
  opacity: 0.9;
  margin-top: 4px;
}

.weather-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weather-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  opacity: 0.9;
}

.weather-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  opacity: 0.8;
}

@media (max-width: 767px) {
  .weather-card {
    padding: 16px;
    border-radius: var(--radius-sm);
  }

  .weather-icon {
    font-size: 40px;
  }

  .weather-temp {
    font-size: 28px;
  }

  .weather-desc {
    font-size: 14px;
  }

  .weather-location {
    font-size: 13px;
  }

  .weather-detail {
    font-size: 12px;
  }
}
</style>
