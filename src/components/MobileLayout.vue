<template>
  <div class="mobile-layout">
    <!-- 顶部标题栏 -->
    <header class="mobile-header">
      <div class="header-left">
        <span class="header-logo">🌾</span>
        <span class="header-title">{{ currentPageTitle }}</span>
      </div>
      <div class="header-right">
        <button class="header-btn" @click="showSearch = !showSearch">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <button class="header-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="mini-badge">3</span>
        </button>
      </div>
    </header>

    <!-- 搜索栏 -->
    <div class="mobile-search" v-if="showSearch">
      <div class="search-input-wrap">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="搜索服务、产品、政策..." v-model="searchText" />
        <button class="search-cancel" @click="showSearch = false; searchText = ''">取消</button>
      </div>
    </div>

    <!-- 内容区 -->
    <main class="mobile-content">
      <slot></slot>
    </main>

    <!-- 底部TabBar -->
    <nav class="tab-bar">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="tab-item"
        :class="{ active: currentPath === tab.path }"
      >
        <span class="tab-icon" v-html="tab.icon"></span>
        <span class="tab-label">{{ tab.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentPath = computed(() => route.path)
const showSearch = ref(false)
const searchText = ref('')

const tabs = [
  {
    path: '/',
    label: '首页',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    path: '/products',
    label: '农产品',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
  },
  {
    path: '/seed-trading',
    label: '种子',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/></svg>'
  },
  {
    path: '/irrigation',
    label: '灌溉',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.74 5.88a8.04 8.04 0 0 1 1.9 6.14c0 4.42-3.58 8-8 8s-8-3.58-8-8a8.04 8.04 0 0 1 1.9-6.14L12 2.69z"/></svg>'
  },
  {
    path: '/services',
    label: '我的',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  }
]

const pageTitles = {
  '/': '河南农服',
  '/products': '农产品销售',
  '/seed-trading': '种子交易',
  '/irrigation': '灌溉预约',
  '/weather': '天气预报',
  '/agritech': '农技咨询',
  '/supply': '农资采购',
  '/village': '村务公开',
  '/services': '便民服务'
}

const currentPageTitle = computed(() => pageTitles[route.path] || '河南农服')
</script>

<style scoped>
.mobile-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: var(--bg-warm-white);
}

/* 顶部栏 */
.mobile-header {
  height: 56px;
  background: var(--primary-green);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-logo {
  font-size: 24px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.mini-badge {
  position: absolute;
  top: 8px;
  right: 6px;
  width: 16px;
  height: 16px;
  background: #E53935;
  font-size: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* 搜索栏 */
.mobile-search {
  background: var(--bg-white);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-gray);
  border-radius: 20px;
  padding: 10px 14px;
}

.search-input-wrap input {
  flex: 1;
  background: transparent;
  font-size: 15px;
  color: var(--text-primary);
}

.search-input-wrap input::placeholder {
  color: var(--text-light);
}

.search-cancel {
  color: var(--primary-green);
  font-size: 15px;
  font-weight: 500;
  padding: 4px 8px;
  flex-shrink: 0;
}

/* 内容区 */
.mobile-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 70px;
}

/* 底部TabBar */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-white);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  height: 100%;
  color: var(--text-light);
  transition: var(--transition);
  text-decoration: none;
  min-height: 44px;
}

.tab-item.active {
  color: var(--primary-green);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
}
</style>
