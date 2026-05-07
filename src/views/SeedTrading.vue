<template>
  <div class="seed-trading-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" placeholder="搜索种子品种、产地..." v-model="searchText" />
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

    <!-- 种子列表 -->
    <div class="seed-grid">
      <div
        v-for="seed in filteredSeeds"
        :key="seed.id"
        class="seed-card"
        @click="showDetail(seed)"
      >
        <div class="seed-image">{{ seed.emoji }}</div>
        <div class="seed-info">
          <h4 class="seed-name">{{ seed.name }}</h4>
          <p class="seed-origin">📍 {{ seed.origin }}</p>
          <div class="seed-tags">
            <span class="tag">发芽率{{ seed.germinationRate }}</span>
            <span class="tag">{{ seed.weight }}</span>
          </div>
          <div class="seed-footer">
            <span class="seed-price">¥{{ seed.price }}<small>/袋</small></span>
            <span class="seed-supplier">{{ seed.supplier }}</span>
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

    <!-- 种子详情弹窗 -->
    <div class="modal-overlay" v-if="selectedSeed" @click.self="selectedSeed = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ selectedSeed.name }}</h3>
          <button class="modal-close" @click="selectedSeed = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-image">{{ selectedSeed.emoji }}</div>
          <div class="modal-info">
            <div class="modal-price">¥{{ selectedSeed.price }}<small>/袋</small></div>
            <div class="info-row">
              <span class="info-label">品种类型：</span>
              <span class="info-value">{{ selectedSeed.category }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">产地：</span>
              <span class="info-value">{{ selectedSeed.origin }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">发芽率：</span>
              <span class="info-value">{{ selectedSeed.germinationRate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">净含量：</span>
              <span class="info-value">{{ selectedSeed.weight }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">供应商：</span>
              <span class="info-value">{{ selectedSeed.supplier }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">品种特性：</span>
              <span class="info-value">{{ selectedSeed.desc }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-contact">联系供应商</button>
          <button class="btn-buy">立即购买</button>
        </div>
      </div>
    </div>

    <!-- 发布弹窗 -->
    <div class="modal-overlay" v-if="showPublish" @click.self="showPublish = false">
      <div class="modal-content publish-modal">
        <div class="modal-header">
          <h3>发布种子信息</h3>
          <button class="modal-close" @click="showPublish = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>品种名称</label>
            <input type="text" placeholder="请输入品种名称" v-model="publishForm.name" />
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="publishForm.category">
              <option value="小麦">小麦</option>
              <option value="玉米">玉米</option>
              <option value="菜籽">菜籽</option>
              <option value="西瓜">西瓜</option>
              <option value="辣椒">辣椒</option>
            </select>
          </div>
          <div class="form-group">
            <label>价格（元/袋）</label>
            <input type="number" placeholder="请输入价格" v-model="publishForm.price" />
          </div>
          <div class="form-group">
            <label>产地</label>
            <input type="text" placeholder="请输入产地" v-model="publishForm.origin" />
          </div>
          <div class="form-group">
            <label>发芽率</label>
            <input type="text" placeholder="如：95%" v-model="publishForm.germinationRate" />
          </div>
          <div class="form-group">
            <label>净含量</label>
            <input type="text" placeholder="如：5kg/袋" v-model="publishForm.weight" />
          </div>
          <div class="form-group">
            <label>品种描述</label>
            <textarea placeholder="请描述品种特性..." rows="3" v-model="publishForm.desc"></textarea>
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
const selectedSeed = ref(null)
const showPublish = ref(false)

const publishForm = ref({
  name: '',
  category: '小麦',
  price: '',
  origin: '',
  germinationRate: '',
  weight: '',
  desc: ''
})

const categories = ['全部', '小麦', '玉米', '菜籽', '西瓜', '辣椒']

const seeds = [
  { id: 1, name: '郑麦1860', category: '小麦', price: '45', origin: '河南郑州', supplier: '河南农科院', emoji: '🌾', germinationRate: '95%', weight: '15kg/袋', desc: '优质强筋小麦，抗病性强，产量高，适合制作高档面粉。' },
  { id: 2, name: '济麦22', category: '小麦', price: '42', origin: '山东济南', supplier: '山东种业', emoji: '🌾', germinationRate: '93%', weight: '15kg/袋', desc: '中强筋小麦，适应性广，抗倒伏，是黄淮海地区主栽品种。' },
  { id: 3, name: '周麦27', category: '小麦', price: '40', origin: '河南周口', supplier: '周口种子站', emoji: '🌾', germinationRate: '94%', weight: '15kg/袋', desc: '高产稳产，抗寒性好，分蘖力强，适合机械化收获。' },
  { id: 4, name: '郑单958', category: '玉米', price: '55', origin: '河南郑州', supplier: '河南农科院', emoji: '🌽', germinationRate: '96%', weight: '2kg/袋', desc: '高产玉米杂交种，株型紧凑，耐密植，适合机收。' },
  { id: 5, name: '先玉335', category: '玉米', price: '68', origin: '甘肃张掖', supplier: '敦煌种业', emoji: '🌽', germinationRate: '95%', weight: '2kg/袋', desc: '优质饲料玉米，籽粒饱满，脱水快，深受养殖户欢迎。' },
  { id: 6, name: '登海605', category: '玉米', price: '62', origin: '山东莱州', supplier: '登海种业', emoji: '🌽', germinationRate: '94%', weight: '2kg/袋', desc: '超高产玉米品种，抗倒伏，抗病性强，适合春播。' },
  { id: 7, name: '中双11号', category: '菜籽', price: '35', origin: '湖北武汉', supplier: '中油所', emoji: '🌱', germinationRate: '92%', weight: '500g/袋', desc: '双低油菜品种，含油率高，芥酸含量低，适合榨油。' },
  { id: 8, name: '华油杂62', category: '菜籽', price: '38', origin: '湖北荆州', supplier: '华中农大', emoji: '🌱', germinationRate: '93%', weight: '500g/袋', desc: '高产油菜杂交种，抗倒伏，适合长江流域种植。' },
  { id: 9, name: '8424麒麟瓜', category: '西瓜', price: '128', origin: '新疆吐鲁番', supplier: '新疆种业', emoji: '🍉', germinationRate: '90%', weight: '50g/袋', desc: '经典西瓜品种，糖度高，口感酥脆，皮薄肉红。' },
  { id: 10, name: '甜王西瓜', category: '西瓜', price: '98', origin: '河南开封', supplier: '开封种子公司', emoji: '🍉', germinationRate: '91%', weight: '50g/袋', desc: '高产西瓜品种，果实大，耐储运，适合露地栽培。' },
  { id: 11, name: '朝天椒', category: '辣椒', price: '25', origin: '河南商丘', supplier: '商丘农科所', emoji: '🌶️', germinationRate: '88%', weight: '100g/袋', desc: '辣味浓郁，果实朝天生长，适合制作干辣椒。' },
  { id: 12, name: '线椒', category: '辣椒', price: '22', origin: '陕西宝鸡', supplier: '陕西种业', emoji: '🌶️', germinationRate: '89%', weight: '100g/袋', desc: '果形细长，辣味适中，适合鲜食和加工。' },
  { id: 13, name: '螺丝椒', category: '辣椒', price: '28', origin: '山东潍坊', supplier: '潍坊种子站', emoji: '🌶️', germinationRate: '90%', weight: '100g/袋', desc: '果形螺旋，皮薄肉厚，口感脆嫩，深受市场欢迎。' }
]

const filteredSeeds = computed(() => {
  let list = seeds
  if (activeCategory.value !== '全部') {
    list = list.filter(s => s.category === activeCategory.value)
  }
  if (searchText.value) {
    const kw = searchText.value.toLowerCase()
    list = list.filter(s => s.name.includes(kw) || s.origin.includes(kw) || s.supplier.includes(kw))
  }
  return list
})

const showDetail = (seed) => {
  selectedSeed.value = seed
}

const handlePublish = () => {
  alert('发布成功！（演示功能）')
  showPublish.value = false
  publishForm.value = { name: '', category: '小麦', price: '', origin: '', germinationRate: '', weight: '', desc: '' }
}
</script>

<style scoped>
.seed-trading-page {
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

/* 种子网格 */
.seed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.seed-card {
  background: var(--bg-white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: var(--transition);
}

.seed-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.seed-image {
  width: 100%;
  height: 140px;
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF8E1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
}

.seed-info {
  padding: 14px;
}

.seed-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.seed-origin {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 8px;
}

.seed-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.tag {
  padding: 4px 10px;
  background: var(--bg-gray);
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.seed-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.seed-price {
  font-size: 18px;
  font-weight: 700;
  color: #E53935;
}

.seed-price small {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-light);
}

.seed-supplier {
  font-size: 13px;
  color: var(--text-secondary);
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
  gap: 10px;
}

.modal-price {
  font-size: 24px;
  font-weight: 700;
  color: #E53935;
  margin-bottom: 6px;
}

.modal-price small {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-light);
}

.info-row {
  display: flex;
  font-size: 15px;
}

.info-label {
  color: var(--text-light);
  flex-shrink: 0;
  width: 80px;
}

.info-value {
  color: var(--text-primary);
  flex: 1;
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
  .seed-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .seed-image {
    height: 110px;
    font-size: 44px;
  }

  .seed-info {
    padding: 10px;
  }

  .seed-name {
    font-size: 14px;
  }

  .seed-tags {
    flex-wrap: wrap;
  }

  .tag {
    font-size: 11px;
    padding: 3px 8px;
  }

  .seed-price {
    font-size: 16px;
  }

  .seed-supplier {
    font-size: 12px;
  }

  .fab-btn {
    bottom: 76px;
    right: 16px;
    width: 52px;
    height: 52px;
  }
}
</style>
