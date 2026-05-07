<template>
  <div class="pc-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">🌾</span>
        <span class="logo-text">河南农服</span>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: currentPath === item.path }"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">张</div>
          <span class="user-name">张大伯</span>
        </div>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <div class="main-area">
      <!-- 顶部栏 -->
      <header class="top-bar">
        <div class="top-bar-left">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
        </div>
        <div class="top-bar-right">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="搜索服务、产品、政策..." />
          </div>
          <button class="notification-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="badge">3</span>
          </button>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="content-area">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentPath = computed(() => route.path)

const navItems = [
  {
    path: '/',
    label: '首页',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    path: '/products',
    label: '农产品销售',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
  },
  {
    path: '/seed-trading',
    label: '种子交易',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>'
  },
  {
    path: '/irrigation',
    label: '灌溉预约',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.74 5.88a8.04 8.04 0 0 1 1.9 6.14c0 4.42-3.58 8-8 8s-8-3.58-8-8a8.04 8.04 0 0 1 1.9-6.14L12 2.69z"/><path d="M12 10v8"/><path d="M8 14h8"/></svg>'
  },
  {
    path: '/weather',
    label: '天气预报',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>'
  },
  {
    path: '/agritech',
    label: '农技咨询',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
  },
  {
    path: '/supply',
    label: '农资采购',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
  },
  {
    path: '/village',
    label: '村务公开',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>'
  },
  {
    path: '/services',
    label: '便民服务',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
  }
]

const pageTitles = {
  '/': '首页',
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
.pc-layout {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}

/* 侧边栏 */
.sidebar {
  width: 220px;
  min-width: 220px;
  background: linear-gradient(180deg, var(--primary-green-dark) 0%, var(--primary-green) 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  color: rgba(255, 255, 255, 0.8);
  transition: var(--transition);
  font-size: 15px;
  min-height: 48px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent-yellow);
  color: var(--primary-green-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.user-name {
  font-size: 15px;
}

/* 主区域 */
.main-area {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 顶部栏 */
.top-bar {
  height: 64px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-gray);
  border-radius: 20px;
  padding: 8px 16px;
  width: 300px;
}

.search-box input {
  flex: 1;
  background: transparent;
  font-size: 14px;
  color: var(--text-primary);
}

.search-box input::placeholder {
  color: var(--text-light);
}

.notification-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-secondary);
  transition: var(--transition);
}

.notification-btn:hover {
  background: var(--bg-gray);
  color: var(--primary-green);
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  background: #E53935;
  color: #fff;
  font-size: 11px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* 内容区 */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: var(--bg-warm-white);
}
</style>
