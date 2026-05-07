<template>
  <div class="supply-page">
    <!-- 轮播Banner -->
    <div class="banner-section">
      <div class="banner-slider">
        <div class="banner-item" :style="{ background: banners[currentBanner].bg }">
          <div class="banner-text">
            <h3>{{ banners[currentBanner].title }}</h3>
            <p>{{ banners[currentBanner].desc }}</p>
          </div>
          <div class="banner-emoji">{{ banners[currentBanner].emoji }}</div>
        </div>
        <div class="banner-dots">
          <span
            v-for="(_, i) in banners"
            :key="i"
            class="dot"
            :class="{ active: i === currentBanner }"
            @click="currentBanner = i"
          ></span>
        </div>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div
        v-for="cat in supplyCategories"
        :key="cat.name"
        class="cat-item"
        @click="activeCategory = cat.name"
      >
        <div class="cat-icon">{{ cat.icon }}</div>
        <span class="cat-label">{{ cat.name }}</span>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="goods-section">
      <div class="section-title">
        <span class="title-bar"></span>
        {{ activeCategory === '全部' ? '热门商品' : activeCategory }}
      </div>
      <div class="goods-grid">
        <div
          v-for="goods in filteredGoods"
          :key="goods.id"
          class="goods-card"
        >
          <div class="goods-image">{{ goods.emoji }}</div>
          <div class="goods-info">
            <h4 class="goods-name text-ellipsis">{{ goods.name }}</h4>
            <p class="goods-sales">已售 {{ goods.sales }}</p>
            <div class="goods-bottom">
              <span class="goods-price">¥{{ goods.price }}</span>
              <button
                class="btn-add"
                :class="{ added: cartItems.includes(goods.id) }"
                @click="toggleCart(goods.id)"
              >
                {{ cartItems.includes(goods.id) ? '✓' : '+' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 购物车浮动栏 -->
    <div class="cart-bar" v-if="cartItems.length > 0" @click="showCart = true">
      <div class="cart-icon-wrap">
        <span class="cart-icon">🛒</span>
        <span class="cart-count">{{ cartItems.length }}</span>
      </div>
      <div class="cart-info">
        <span class="cart-total">合计：¥{{ cartTotal }}</span>
        <span class="cart-hint">点击查看购物车</span>
      </div>
      <button class="cart-btn">去结算</button>
    </div>

    <!-- 购物车弹窗 -->
    <div class="modal-overlay" v-if="showCart" @click.self="showCart = false">
      <div class="modal-content cart-modal">
        <div class="modal-header">
          <h3>购物车（{{ cartItems.length }}件）</h3>
          <button class="modal-close" @click="showCart = false">✕</button>
        </div>
        <div class="modal-body">
          <div v-for="id in cartItems" :key="id" class="cart-item">
            <div class="cart-item-emoji">{{ getGoodsById(id).emoji }}</div>
            <div class="cart-item-info">
              <span class="cart-item-name">{{ getGoodsById(id).name }}</span>
              <span class="cart-item-price">¥{{ getGoodsById(id).price }}</span>
            </div>
            <button class="cart-remove" @click="removeFromCart(id)">删除</button>
          </div>
          <div v-if="cartItems.length === 0" class="cart-empty">
            购物车是空的
          </div>
        </div>
        <div class="modal-footer" v-if="cartItems.length > 0">
          <div class="cart-footer-total">合计：¥{{ cartTotal }}</div>
          <button class="btn-checkout" @click="handleCheckout">提交订单</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentBanner = ref(0)
const activeCategory = ref('全部')
const cartItems = ref([])
const showCart = ref(false)
let bannerTimer = null

const banners = [
  { title: '冬储化肥促销', desc: '优质复合肥满100减20', emoji: '🧪', bg: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)' },
  { title: '种子新品上市', desc: '2025年优质小麦种预售中', emoji: '🌱', bg: 'linear-gradient(135deg, #F9A825 0%, #FFD54F 100%)' },
  { title: '农机具补贴', desc: '购农机享政府补贴30%', emoji: '🚜', bg: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)' }
]

const supplyCategories = [
  { name: '全部', icon: '📦' },
  { name: '种子', icon: '🌱' },
  { name: '化肥', icon: '🧪' },
  { name: '农药', icon: '💧' },
  { name: '农机具', icon: '🚜' },
  { name: '饲料', icon: '🌾' }
]

const goods = [
  { id: 1, name: '优质小麦种（郑麦119）', price: '4.5', sales: '2.3万斤', emoji: '🌱', category: '种子' },
  { id: 2, name: '复合肥（15-15-15）', price: '185', sales: '5.6吨', emoji: '🧪', category: '化肥' },
  { id: 3, name: '尿素（46%含氮量）', price: '135', sales: '8.2吨', emoji: '⚗️', category: '化肥' },
  { id: 4, name: '草甘膦除草剂', price: '28', sales: '1.2万瓶', emoji: '💧', category: '农药' },
  { id: 5, name: '吡虫啉杀虫剂', price: '15', sales: '8600瓶', emoji: '🪲', category: '农药' },
  { id: 6, name: '小型旋耕机', price: '2800', sales: '320台', emoji: '🚜', category: '农机具' },
  { id: 7, name: '电动喷雾器', price: '158', sales: '1500台', emoji: '💨', category: '农机具' },
  { id: 8, name: '猪饲料（育肥期）', price: '165', sales: '12吨', emoji: '🌾', category: '饲料' },
  { id: 9, name: '玉米种（郑单958）', price: '38', sales: '1.8万袋', emoji: '🌽', category: '种子' },
  { id: 10, name: '有机肥（腐熟鸡粪）', price: '45', sales: '6.5吨', emoji: '💩', category: '化肥' },
  { id: 11, name: '多菌灵杀菌剂', price: '12', sales: '6800瓶', emoji: '🛡️', category: '农药' },
  { id: 12, name: '鸡饲料（产蛋期）', price: '145', sales: '9.8吨', emoji: '🐔', category: '饲料' }
]

const filteredGoods = computed(() => {
  if (activeCategory.value === '全部') return goods
  return goods.filter(g => g.category === activeCategory.value)
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((sum, id) => {
    const item = goods.find(g => g.id === id)
    return sum + (item ? parseFloat(item.price) : 0)
  }, 0).toFixed(2)
})

const getGoodsById = (id) => goods.find(g => g.id === id) || {}

const toggleCart = (id) => {
  const idx = cartItems.value.indexOf(id)
  if (idx > -1) {
    cartItems.value.splice(idx, 1)
  } else {
    cartItems.value.push(id)
  }
}

const removeFromCart = (id) => {
  const idx = cartItems.value.indexOf(id)
  if (idx > -1) cartItems.value.splice(idx, 1)
}

const handleCheckout = () => {
  alert('订单提交成功！（演示功能）')
  showCart.value = false
  cartItems.value = []
}

onMounted(() => {
  bannerTimer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.length
  }, 4000)
})

onUnmounted(() => {
  if (bannerTimer) clearInterval(bannerTimer)
})
</script>

<style scoped>
.supply-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 70px;
}

/* 轮播Banner */
.banner-section {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.banner-slider {
  position: relative;
}

.banner-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 24px;
  color: #fff;
  min-height: 140px;
}

.banner-text h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.banner-text p {
  font-size: 14px;
  opacity: 0.9;
}

.banner-emoji {
  font-size: 56px;
}

.banner-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: var(--transition);
}

.dot.active {
  background: var(--primary-green);
  width: 20px;
  border-radius: 4px;
}

/* 分类导航 */
.category-nav {
  display: flex;
  justify-content: space-around;
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 16px 8px;
  box-shadow: var(--shadow);
}

.cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  min-height: 64px;
}

.cat-item:hover {
  background: var(--bg-gray);
}

.cat-icon {
  font-size: 28px;
}

.cat-label {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
}

/* 通用标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.title-bar {
  width: 4px;
  height: 20px;
  background: var(--primary-green);
  border-radius: 2px;
}

/* 商品网格 */
.goods-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 16px 20px;
  box-shadow: var(--shadow);
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.goods-card {
  background: var(--bg-gray);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: var(--transition);
}

.goods-card:hover {
  box-shadow: var(--shadow);
}

.goods-image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF8E1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.goods-info {
  padding: 10px 12px;
}

.goods-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.goods-sales {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 6px;
}

.goods-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods-price {
  font-size: 17px;
  font-weight: 700;
  color: #E53935;
}

.btn-add {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-green);
  color: #fff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.btn-add.added {
  background: var(--accent-yellow);
  color: var(--primary-green-dark);
}

.btn-add:hover {
  transform: scale(1.1);
}

/* 购物车浮动栏 */
.cart-bar {
  position: fixed;
  bottom: 70px;
  left: 16px;
  right: 16px;
  background: #333;
  border-radius: 24px;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  z-index: 50;
  color: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.cart-icon-wrap {
  position: relative;
  margin-right: 12px;
}

.cart-icon {
  font-size: 28px;
}

.cart-count {
  position: absolute;
  top: -6px;
  right: -8px;
  width: 18px;
  height: 18px;
  background: #E53935;
  border-radius: 50%;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.cart-info {
  flex: 1;
}

.cart-total {
  font-size: 16px;
  font-weight: 700;
}

.cart-hint {
  font-size: 12px;
  opacity: 0.7;
}

.cart-btn {
  padding: 8px 20px;
  background: var(--primary-green);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
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
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
  }
}

.modal-content {
  background: var(--bg-white);
  border-radius: var(--radius) var(--radius) 0 0;
  width: 100%;
  max-width: 480px;
  max-height: 70vh;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .modal-content {
    border-radius: var(--radius);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background: var(--bg-white);
  z-index: 1;
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
}

.modal-body {
  padding: 16px 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-emoji {
  font-size: 32px;
  width: 48px;
  height: 48px;
  background: var(--bg-gray);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.cart-item-price {
  font-size: 15px;
  font-weight: 700;
  color: #E53935;
}

.cart-remove {
  padding: 6px 12px;
  color: var(--text-light);
  font-size: 13px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
}

.cart-empty {
  text-align: center;
  padding: 40px 0;
  color: var(--text-light);
  font-size: 15px;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.cart-footer-total {
  font-size: 17px;
  font-weight: 700;
  color: #E53935;
}

.btn-checkout {
  padding: 10px 28px;
  background: var(--primary-green);
  color: #fff;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
}

@media (max-width: 767px) {
  .goods-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .goods-image {
    font-size: 40px;
  }

  .goods-name {
    font-size: 13px;
  }

  .goods-price {
    font-size: 15px;
  }

  .cart-bar {
    bottom: 66px;
    left: 12px;
    right: 12px;
  }
}
</style>
