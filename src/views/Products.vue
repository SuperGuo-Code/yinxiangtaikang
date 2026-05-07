<template>
  <div class="products-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="搜索农产品..." v-model="searchText" />
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        class="tab-btn"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 产品列表 -->
    <div class="product-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-list-card"
        @click="showDetail(product)"
      >
        <div class="product-img">{{ product.emoji }}</div>
        <div class="product-detail">
          <h4 class="product-name">{{ product.name }}</h4>
          <p class="product-desc text-ellipsis-2">{{ product.desc }}</p>
          <div class="product-meta">
            <span class="product-price">¥{{ product.price }}<small>/斤</small></span>
            <span class="product-origin">📍 {{ product.origin }}</span>
          </div>
          <div class="product-seller-row">
            <span class="seller-avatar">{{ product.seller[0] }}</span>
            <span class="seller-name">{{ product.seller }}</span>
            <span class="publish-time">{{ product.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮发布按钮 -->
    <button class="fab-btn" @click="showPublish = true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>

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
            <p><strong>分类：</strong>{{ selectedProduct.category }}</p>
            <p><strong>描述：</strong>{{ selectedProduct.desc }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-contact">联系卖家</button>
          <button class="btn-buy">立即购买</button>
        </div>
      </div>
    </div>

    <!-- 发布弹窗 -->
    <div class="modal-overlay" v-if="showPublish" @click.self="showPublish = false">
      <div class="modal-content publish-modal">
        <div class="modal-header">
          <h3>发布农产品</h3>
          <button class="modal-close" @click="showPublish = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>产品名称</label>
            <input type="text" placeholder="请输入产品名称" v-model="publishForm.name" />
          </div>
          <div class="form-group">
            <label>价格（元/斤）</label>
            <input type="number" placeholder="请输入价格" v-model="publishForm.price" />
          </div>
          <div class="form-group">
            <label>产地</label>
            <input type="text" placeholder="请输入产地" v-model="publishForm.origin" />
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="publishForm.category">
              <option value="粮食">粮食</option>
              <option value="蔬菜">蔬菜</option>
              <option value="水果">水果</option>
              <option value="禽蛋">禽蛋</option>
              <option value="土特产">土特产</option>
            </select>
          </div>
          <div class="form-group">
            <label>产品描述</label>
            <textarea placeholder="请描述您的产品..." rows="3" v-model="publishForm.desc"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showPublish = false">取消</button>
          <button class="btn-submit" @click="handlePublish">发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchText = ref('')
const activeCategory = ref('全部')
const selectedProduct = ref(null)
const showPublish = ref(false)

const publishForm = ref({
  name: '',
  price: '',
  origin: '',
  category: '粮食',
  desc: ''
})

const categories = ['全部', '粮食', '蔬菜', '水果', '禽蛋', '土特产']

const products = [
  { id: 1, name: '优质小麦', price: '1.35', origin: '河南周口', seller: '王大叔', emoji: '🌾', category: '粮食', time: '2小时前', desc: '当年新麦，颗粒饱满，品质优良，适合面粉加工。产量充足，欢迎大批量采购。' },
  { id: 2, name: '新鲜大白菜', price: '0.8', origin: '河南许昌', seller: '李大姐', emoji: '🥬', category: '蔬菜', time: '3小时前', desc: '自家菜地种植，不施农药，新鲜可口。每棵约3-5斤。' },
  { id: 3, name: '土鸡蛋', price: '1.5', origin: '河南南阳', seller: '赵大哥', emoji: '🥚', category: '禽蛋', time: '5小时前', desc: '散养土鸡所产，蛋黄饱满，营养丰富。日产约200枚。' },
  { id: 4, name: '红薯', price: '1.2', origin: '河南洛阳', seller: '刘婶', emoji: '🍠', category: '粮食', time: '1天前', desc: '沙土地种植，口感绵甜，适合蒸煮烤。品种为商薯19。' },
  { id: 5, name: '花生', price: '4.5', origin: '河南开封', seller: '陈伯', emoji: '🥜', category: '土特产', time: '1天前', desc: '本地小花生，颗粒均匀，香脆可口。可用于榨油或直接食用。' },
  { id: 6, name: '苹果', price: '3.8', origin: '河南三门峡', seller: '张阿姨', emoji: '🍎', category: '水果', time: '2天前', desc: '灵宝苹果，脆甜多汁，自然成熟。果径80mm以上。' },
  { id: 7, name: '玉米', price: '1.1', origin: '河南商丘', seller: '孙大哥', emoji: '🌽', category: '粮食', time: '2天前', desc: '饲料玉米，籽粒饱满，水分低。可零售可批发。' },
  { id: 8, name: '西红柿', price: '2.5', origin: '河南驻马店', seller: '马大姐', emoji: '🍅', category: '蔬菜', time: '3天前', desc: '大棚种植，自然成熟，酸甜可口。每斤约4-6个。' },
  { id: 9, name: '大葱', price: '1.8', origin: '河南新乡', seller: '周伯', emoji: '🧅', category: '蔬菜', time: '3天前', desc: '章丘大葱品种，葱白长，味道浓郁。' },
  { id: 10, name: '蜂蜜', price: '35', origin: '河南信阳', seller: '吴大叔', emoji: '🍯', category: '土特产', time: '5天前', desc: '纯天然土蜂蜜，百花蜜，无添加。500g瓶装。' }
]

const filteredProducts = computed(() => {
  let list = products
  if (activeCategory.value !== '全部') {
    list = list.filter(p => p.category === activeCategory.value)
  }
  if (searchText.value) {
    const kw = searchText.value.toLowerCase()
    list = list.filter(p => p.name.includes(kw) || p.origin.includes(kw))
  }
  return list
})

const showDetail = (product) => {
  selectedProduct.value = product
}

const handlePublish = () => {
  alert('发布成功！（演示功能）')
  showPublish.value = false
  publishForm.value = { name: '', price: '', origin: '', category: '粮食', desc: '' }
}
</script>

<style scoped>
.products-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 搜索栏 */
.search-bar {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: var(--shadow);
}

.search-input {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-gray);
  border-radius: 24px;
  padding: 12px 20px;
}

.search-input input {
  flex: 1;
  background: transparent;
  font-size: 15px;
  color: var(--text-primary);
}

.search-input input::placeholder {
  color: var(--text-light);
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
}

.tab-btn {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-white);
  border: 1px solid var(--border-color);
  white-space: nowrap;
  transition: var(--transition);
  min-height: 40px;
}

.tab-btn.active {
  background: var(--primary-green);
  color: #fff;
  border-color: var(--primary-green);
}

/* 产品列表 */
.product-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-list-card {
  display: flex;
  gap: 14px;
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 14px;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: var(--transition);
}

.product-list-card:hover {
  box-shadow: var(--shadow-lg);
}

.product-img {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF8E1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  flex-shrink: 0;
}

.product-detail {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.product-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 4px 0;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #E53935;
}

.product-price small {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-light);
}

.product-origin {
  font-size: 13px;
  color: var(--text-light);
}

.product-seller-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.seller-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent-yellow);
  color: var(--primary-green-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.seller-name {
  font-size: 13px;
  color: var(--text-secondary);
}

.publish-time {
  font-size: 12px;
  color: var(--text-light);
  margin-left: auto;
}

/* 悬浮按钮 */
.fab-btn {
  position: fixed;
  bottom: 80px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-green);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.4);
  z-index: 50;
  transition: var(--transition);
}

.fab-btn:hover {
  background: var(--primary-green-dark);
  transform: scale(1.05);
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
  max-height: 85vh;
  overflow-y: auto;
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
}

.btn-buy {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--primary-green);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

/* 发布表单 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 15px;
  color: var(--text-primary);
  background: var(--bg-gray);
  transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary-green);
  outline: none;
}

.form-group textarea {
  resize: vertical;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 500;
}

.btn-submit {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--primary-green);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

@media (max-width: 767px) {
  .product-img {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }

  .product-name {
    font-size: 15px;
  }

  .fab-btn {
    bottom: 76px;
    right: 16px;
    width: 52px;
    height: 52px;
  }
}
</style>
