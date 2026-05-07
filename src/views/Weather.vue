<template>
  <div class="weather-page">
    <!-- 当前天气大卡片 -->
    <div class="current-weather">
      <div class="weather-main">
        <div class="weather-icon-large">{{ currentWeather.icon }}</div>
        <div class="weather-temp-large">
          <span class="temp-value">{{ currentWeather.temperature }}</span>
          <span class="temp-unit">°C</span>
        </div>
      </div>
      <div class="weather-desc-large">{{ currentWeather.description }}</div>
      <div class="weather-location-large">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        {{ currentWeather.location }}
      </div>
      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-icon">💧</span>
          <span class="detail-label">湿度</span>
          <span class="detail-value">{{ currentWeather.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">💨</span>
          <span class="detail-label">风力</span>
          <span class="detail-value">{{ currentWeather.wind }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🌡️</span>
          <span class="detail-label">体感</span>
          <span class="detail-value">{{ currentWeather.feelsLike }}°C</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🌫️</span>
          <span class="detail-label">空气质量</span>
          <span class="detail-value" :class="getAqiClass(currentWeather.aqi)">{{ currentWeather.aqi }}</span>
        </div>
      </div>
      <div class="update-time">更新时间：{{ currentWeather.updateTime }}</div>
    </div>

    <!-- 7天天气预报 -->
    <div class="forecast-section">
      <div class="section-title">
        <span class="title-bar"></span>
        7天预报
      </div>
      <div class="forecast-list">
        <div
          v-for="(day, index) in forecast"
          :key="index"
          class="forecast-item"
          :class="{ 'today': index === 0 }"
        >
          <span class="forecast-day">{{ day.day }}</span>
          <span class="forecast-date">{{ day.date }}</span>
          <span class="forecast-icon">{{ day.icon }}</span>
          <span class="forecast-desc">{{ day.description }}</span>
          <div class="forecast-temp">
            <span class="temp-high">{{ day.high }}°</span>
            <span class="temp-low">{{ day.low }}°</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 农事建议 -->
    <div class="farming-section">
      <div class="section-title">
        <span class="title-bar"></span>
        农事建议
      </div>
      <div class="farming-cards">
        <div class="farming-card sowing">
          <div class="farming-icon">🌱</div>
          <div class="farming-content">
            <h4>播种建议</h4>
            <p>{{ farmingAdvice.sowing }}</p>
          </div>
        </div>
        <div class="farming-card irrigation">
          <div class="farming-icon">💧</div>
          <div class="farming-content">
            <h4>灌溉建议</h4>
            <p>{{ farmingAdvice.irrigation }}</p>
          </div>
        </div>
        <div class="farming-card fertilizing">
          <div class="farming-icon">🧪</div>
          <div class="farming-content">
            <h4>施肥建议</h4>
            <p>{{ farmingAdvice.fertilizing }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 灾害预警 -->
    <div class="warning-section" v-if="warnings.length > 0">
      <div class="section-title">
        <span class="title-bar"></span>
        灾害预警
      </div>
      <div class="warning-list">
        <div
          v-for="warning in warnings"
          :key="warning.id"
          class="warning-card"
          :class="warning.level"
        >
          <div class="warning-header">
            <span class="warning-icon">{{ warning.icon }}</span>
            <span class="warning-type">{{ warning.type }}</span>
            <span class="warning-level">{{ warning.levelText }}</span>
          </div>
          <p class="warning-content">{{ warning.content }}</p>
          <div class="warning-time">发布时间：{{ warning.time }}</div>
        </div>
      </div>
    </div>

    <!-- 生活指数 -->
    <div class="life-index-section">
      <div class="section-title">
        <span class="title-bar"></span>
        生活指数
      </div>
      <div class="life-index-grid">
        <div class="life-index-item">
          <span class="index-icon">👕</span>
          <span class="index-label">穿衣</span>
          <span class="index-value">较冷</span>
        </div>
        <div class="life-index-item">
          <span class="index-icon">🚗</span>
          <span class="index-label">洗车</span>
          <span class="index-value">适宜</span>
        </div>
        <div class="life-index-item">
          <span class="index-icon">🏃</span>
          <span class="index-label">运动</span>
          <span class="index-value">适宜</span>
        </div>
        <div class="life-index-item">
          <span class="index-icon">😷</span>
          <span class="index-label">感冒</span>
          <span class="index-value">易发</span>
        </div>
        <div class="life-index-item">
          <span class="index-icon">🌞</span>
          <span class="index-label">防晒</span>
          <span class="index-value">中等</span>
        </div>
        <div class="life-index-item">
          <span class="index-icon">🎣</span>
          <span class="index-label">钓鱼</span>
          <span class="index-value">适宜</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 当前天气数据
const currentWeather = ref({
  location: '河南周口太康',
  temperature: 25,
  description: '多云转晴',
  icon: '⛅',
  humidity: 65,
  wind: '东南风3级',
  feelsLike: 26,
  aqi: '良',
  updateTime: '14:30'
})

// 7天预报数据
const forecast = ref([
  { day: '今天', date: '05/07', icon: '⛅', description: '多云转晴', high: 26, low: 15 },
  { day: '明天', date: '05/08', icon: '☀️', description: '晴', high: 28, low: 16 },
  { day: '周六', date: '05/09', icon: '☀️', description: '晴', high: 29, low: 17 },
  { day: '周日', date: '05/10', icon: '⛅', description: '多云', high: 27, low: 16 },
  { day: '周一', date: '05/11', icon: '🌧️', description: '小雨', high: 24, low: 14 },
  { day: '周二', date: '05/12', icon: '⛅', description: '多云', high: 25, low: 15 },
  { day: '周三', date: '05/13', icon: '☀️', description: '晴', high: 28, low: 16 }
])

// 农事建议
const farmingAdvice = ref({
  sowing: '当前气温适宜，正值春播季节，建议抓紧时机进行玉米、大豆等作物播种。注意保持土壤墒情。',
  irrigation: '近期气温升高，土壤水分蒸发加快，建议根据作物长势适时灌溉，保持土壤湿润。',
  fertilizing: '春播作物已进入生长期，建议根据苗情追施氮肥，促进作物健壮生长。'
})

// 灾害预警
const warnings = ref([
  {
    id: 1,
    type: '大风',
    level: 'blue',
    levelText: '蓝色预警',
    icon: '🌬️',
    content: '预计未来24小时内将有4-5级偏北风，阵风可达6-7级，请注意防范大风对农业设施的影响。',
    time: '2026-05-07 10:00'
  }
])

// 获取空气质量样式类
const getAqiClass = (aqi) => {
  const classMap = {
    '优': 'aqi-excellent',
    '良': 'aqi-good',
    '轻度污染': 'aqi-mild',
    '中度污染': 'aqi-moderate',
    '重度污染': 'aqi-severe'
  }
  return classMap[aqi] || ''
}
</script>

<style scoped>
.weather-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 当前天气大卡片 */
.current-weather {
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-light) 100%);
  border-radius: var(--radius);
  padding: 28px 24px;
  color: #fff;
  box-shadow: var(--shadow);
  text-align: center;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.weather-icon-large {
  font-size: 72px;
  line-height: 1;
}

.weather-temp-large {
  display: flex;
  align-items: flex-start;
}

.temp-value {
  font-size: 64px;
  font-weight: 300;
  line-height: 1;
}

.temp-unit {
  font-size: 24px;
  font-weight: 400;
  margin-top: 8px;
}

.weather-desc-large {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 8px;
}

.weather-location-large {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 15px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-sm);
  padding: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.detail-icon {
  font-size: 20px;
}

.detail-label {
  font-size: 12px;
  opacity: 0.8;
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
}

.aqi-excellent {
  color: #A5D6A7;
}

.aqi-good {
  color: #FFF59D;
}

.aqi-mild {
  color: #FFCC80;
}

.aqi-moderate {
  color: #FFAB91;
}

.aqi-severe {
  color: #EF9A9A;
}

.update-time {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 16px;
}

/* 通用标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.title-bar {
  width: 4px;
  height: 20px;
  background: var(--primary-green);
  border-radius: 2px;
}

/* 7天预报 */
.forecast-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.forecast-item {
  display: flex;
  align-items: center;
  padding: 14px 12px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.forecast-item:hover {
  background: var(--bg-gray);
}

.forecast-item.today {
  background: #E8F5E9;
}

.forecast-day {
  width: 50px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.forecast-date {
  width: 60px;
  font-size: 13px;
  color: var(--text-light);
}

.forecast-icon {
  width: 40px;
  font-size: 24px;
  text-align: center;
}

.forecast-desc {
  flex: 1;
  font-size: 14px;
  color: var(--text-secondary);
}

.forecast-temp {
  display: flex;
  gap: 12px;
  width: 70px;
  justify-content: flex-end;
}

.temp-high {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.temp-low {
  font-size: 15px;
  color: var(--text-light);
}

/* 农事建议 */
.farming-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.farming-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.farming-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border-radius: var(--radius-sm);
  border-left: 4px solid var(--primary-green);
  background: var(--bg-gray);
}

.farming-card.sowing {
  border-left-color: #4CAF50;
}

.farming-card.irrigation {
  border-left-color: #2196F3;
}

.farming-card.fertilizing {
  border-left-color: #FF9800;
}

.farming-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.farming-content h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.farming-content p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 灾害预警 */
.warning-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warning-card {
  padding: 16px;
  border-radius: var(--radius-sm);
  border-left: 4px solid;
}

.warning-card.blue {
  background: #E3F2FD;
  border-left-color: #2196F3;
}

.warning-card.yellow {
  background: #FFF8E1;
  border-left-color: #FBC02D;
}

.warning-card.orange {
  background: #FFF3E0;
  border-left-color: #F57C00;
}

.warning-card.red {
  background: #FFEBEE;
  border-left-color: #E53935;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.warning-icon {
  font-size: 20px;
}

.warning-type {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.warning-level {
  margin-left: auto;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.warning-card.blue .warning-level {
  background: #2196F3;
  color: #fff;
}

.warning-card.yellow .warning-level {
  background: #FBC02D;
  color: #fff;
}

.warning-card.orange .warning-level {
  background: #F57C00;
  color: #fff;
}

.warning-card.red .warning-level {
  background: #E53935;
  color: #fff;
}

.warning-content {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 10px;
}

.warning-time {
  font-size: 12px;
  color: var(--text-light);
}

/* 生活指数 */
.life-index-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.life-index-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.life-index-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: var(--bg-gray);
  border-radius: var(--radius-sm);
}

.index-icon {
  font-size: 28px;
}

.index-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.index-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 767px) {
  .current-weather {
    padding: 20px 16px;
  }

  .weather-icon-large {
    font-size: 56px;
  }

  .temp-value {
    font-size: 48px;
  }

  .temp-unit {
    font-size: 20px;
  }

  .weather-desc-large {
    font-size: 18px;
  }

  .weather-details {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 8px;
    padding: 16px 12px;
  }

  .forecast-section,
  .farming-section,
  .warning-section,
  .life-index-section {
    padding: 16px;
  }

  .forecast-item {
    padding: 12px 8px;
  }

  .forecast-day {
    width: 40px;
    font-size: 14px;
  }

  .forecast-date {
    width: 50px;
    font-size: 12px;
  }

  .forecast-icon {
    width: 36px;
    font-size: 20px;
  }

  .forecast-desc {
    font-size: 13px;
  }

  .forecast-temp {
    width: 60px;
    gap: 8px;
  }

  .temp-high,
  .temp-low {
    font-size: 14px;
  }

  .farming-card {
    padding: 14px;
  }

  .farming-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .farming-content h4 {
    font-size: 14px;
  }

  .farming-content p {
    font-size: 13px;
  }

  .life-index-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .life-index-item {
    padding: 12px 8px;
  }

  .index-icon {
    font-size: 24px;
  }

  .index-label {
    font-size: 12px;
  }

  .index-value {
    font-size: 13px;
  }
}
</style>
