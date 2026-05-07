<template>
  <div class="home-page">
    <!-- 用户问候 -->
    <div class="greeting">
      <h1>{{ greeting }}，张大伯！</h1>
      <p class="greeting-date">{{ currentDate }}</p>
    </div>

    <!-- 天气卡片 -->
    <router-link to="/weather" class="weather-link">
      <WeatherCard
        location="河南周口太康"
        temperature="25"
        description="多云转晴"
        wind="东南风3级"
        humidity="65"
        weather-icon="⛅"
      />
    </router-link>

    <!-- 快捷入口 -->
    <section class="quick-entry">
      <div class="section-title">
        <span class="title-bar"></span>
        快捷服务
      </div>
      <div class="entry-grid">
        <router-link
          v-for="item in quickEntries"
          :key="item.path"
          :to="item.path"
          class="entry-item"
        >
          <div class="entry-icon" :style="{ background: item.bg }">{{ item.icon }}</div>
          <span class="entry-label">{{ item.label }}</span>
        </router-link>
      </div>
    </section>

    <!-- 公告通知 -->
    <section class="notice-section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-bar"></span>
          通知公告
        </div>
        <router-link to="/village" class="more-link">查看更多 ›</router-link>
      </div>
      <div class="notice-list">
        <NoticeItem
          v-for="notice in notices"
          :key="notice.id"
          :title="notice.title"
          :summary="notice.summary"
          :date="notice.date"
          :source="notice.source"
          :pinned="notice.pinned"
        />
      </div>
    </section>

    <!-- 热门农产品推荐 -->
    <section class="recommend-section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-bar"></span>
          热门农产品
        </div>
        <router-link to="/products" class="more-link">查看更多 ›</router-link>
      </div>
      <div class="recommend-scroll">
        <ProductCard
          v-for="product in hotProducts"
          :key="product.id"
          :name="product.name"
          :price="product.price"
          :origin="product.origin"
          :seller="product.seller"
          :emoji="product.emoji"
          @click="showProductDetail(product)"
        />
      </div>
    </section>

    <!-- 产品详情弹窗 -->
    <div class="modal-overlay" v-if="selectedProduct" @click.self="selectedProduct = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ selectedProduct.name }}</h3>
          <button class="modal-close" @click="selectedProduct = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-image">{{ selectedProduct.emoji }}</div>
          <div class="modal-info">
            <div class="modal-price">¥{{ selectedProduct.price }}<small>/斤</small></div>
            <p><strong>产地：</strong>{{ selectedProduct.origin }}</p>
            <p><strong>发布人：</strong>{{ selectedProduct.seller }}</p>
            <p><strong>描述：</strong>{{ selectedProduct.desc }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-contact">联系卖家</button>
          <button class="btn-buy">立即购买</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WeatherCard from '../components/WeatherCard.vue'
import ProductCard from '../components/ProductCard.vue'
import NoticeItem from '../components/NoticeItem.vue'

const selectedProduct = ref(null)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 9) return '早上好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const currentDate = computed(() => {
  const d = new Date('2026-05-07')
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekDays[d.getDay()]}`
})

const quickEntries = [
  { icon: '🥬', label: '农产品销售', path: '/products', bg: '#E8F5E9' },
  { icon: '🌾', label: '种子交易', path: '/seed-trading', bg: '#FFF8E1' },
  { icon: '💧', label: '灌溉预约', path: '/irrigation', bg: '#E3F2FD' },
  { icon: '🌱', label: '农技咨询', path: '/agritech', bg: '#F1F8E9' },
  { icon: '🛒', label: '农资采购', path: '/supply', bg: '#FFF3E0' },
  { icon: '📋', label: '村务公开', path: '/village', bg: '#E3F2FD' }
]

const notices = [
  {
    id: 1,
    title: '关于2026年度耕地地力保护补贴发放的通知',
    summary: '根据上级文件精神，现就2026年度耕地地力保护补贴发放工作通知如下...',
    date: '2026-05-06',
    source: '村委会',
    pinned: true
  },
  {
    id: 2,
    title: '春季玉米播种技术指导意见',
    summary: '当前正值春播季节，为确保玉米高产，请广大农户做好以下播种工作...',
    date: '2026-05-05',
    source: '农技站',
    pinned: true
  },
  {
    id: 3,
    title: '关于开展夏收农机具检修的通知',
    summary: '为确保夏收顺利进行，请广大农户提前检修农机具，做好收割准备...',
    date: '2026-05-04',
    source: '村委会',
    pinned: false
  },
  {
    id: 4,
    title: '大风蓝色预警：请注意防范',
    summary: '预计未来24小时内将有4-5级偏北风，阵风可达6-7级，请做好防范措施...',
    date: '2026-05-07',
    source: '气象局',
    pinned: false
  }
]

const hotProducts = [
  { id: 1, name: '优质小麦', price: '1.35', origin: '河南周口', seller: '王大叔', emoji: '🌾', desc: '当年新麦，颗粒饱满，品质优良，适合面粉加工。' },
  { id: 2, name: '新鲜大白菜', price: '0.8', origin: '河南许昌', seller: '李大姐', emoji: '🥬', desc: '自家菜地种植，不施农药，新鲜可口。' },
  { id: 3, name: '土鸡蛋', price: '1.5', origin: '河南南阳', seller: '赵大哥', emoji: '🥚', desc: '散养土鸡所产，蛋黄饱满，营养丰富。' },
  { id: 4, name: '红薯', price: '1.2', origin: '河南洛阳', seller: '刘婶', emoji: '🍠', desc: '沙土地种植，口感绵甜，适合蒸煮烤。' },
  { id: 5, name: '花生', price: '4.5', origin: '河南开封', seller: '陈伯', emoji: '🥜', desc: '本地小花生，颗粒均匀，香脆可口。' },
  { id: 6, name: '苹果', price: '3.8', origin: '河南三门峡', seller: '张阿姨', emoji: '🍎', desc: '灵宝苹果，脆甜多汁，自然成熟。' }
]

const showProductDetail = (product) => {
  selectedProduct.value = product
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 问候语 */
.greeting h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.greeting-date {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* 天气链接 */
.weather-link {
  display: block;
  text-decoration: none;
  transition: var(--transition);
}

.weather-link:hover {
  transform: translateY(-2px);
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

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more-link {
  font-size: 14px;
  color: var(--primary-green);
  text-decoration: none;
  flex-shrink: 0;
}

/* 快捷入口 */
.quick-entry {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: var(--transition);
  min-height: 80px;
}

.entry-item:hover {
  background: var(--bg-gray);
}

.entry-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.entry-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
}

/* 公告通知 */
.notice-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 热门推荐 */
.recommend-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.recommend-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
}

.recommend-scroll > * {
  scroll-snap-align: start;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: var(--bg-white);
  border-radius: var(--radius);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 17px;
  font-weight: 600;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-light);
  font-size: 18px;
  transition: var(--transition);
}

.modal-close:hover {
  background: var(--bg-gray);
}

.modal-body {
  padding: 20px;
}

.modal-image {
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF8E1 100%);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
  margin-bottom: 16px;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 15px;
  color: var(--text-secondary);
}

.modal-price {
  font-size: 24px;
  font-weight: 700;
  color: #E53935;
}

.modal-price small {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-light);
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.btn-contact {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--primary-green);
  color: var(--primary-green);
  font-size: 15px;
  font-weight: 600;
  transition: var(--transition);
}

.btn-contact:hover {
  background: var(--primary-green);
  color: #fff;
}

.btn-buy {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--primary-green);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  transition: var(--transition);
}

.btn-buy:hover {
  background: var(--primary-green-dark);
}

@media (max-width: 767px) {
  .home-page {
    gap: 12px;
  }

  .greeting h1 {
    font-size: 20px;
  }

  .quick-entry {
    padding: 16px;
  }

  .entry-grid {
    gap: 8px;
  }

  .entry-icon {
    width: 46px;
    height: 46px;
    font-size: 22px;
  }

  .entry-label {
    font-size: 13px;
  }

  .notice-section,
  .recommend-section {
    padding: 16px;
  }

  .recommend-scroll > * {
    width: 140px;
  }
}
</style>
