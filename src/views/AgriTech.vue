<template>
  <div class="agritech-page">
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

    <!-- 热门搜索 -->
    <div class="hot-search">
      <div class="section-title">
        <span class="title-bar"></span>
        热门搜索
      </div>
      <div class="tag-list">
        <span
          v-for="tag in hotTags"
          :key="tag"
          class="tag-item"
          @click="searchTag(tag)"
        >{{ tag }}</span>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="article-section">
      <div class="section-title">
        <span class="title-bar"></span>
        {{ activeCategory === '全部' ? '全部文章' : activeCategory }}
      </div>
      <div class="article-list">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="article-card"
          @click="showArticleDetail(article)"
        >
          <div class="article-icon">{{ article.emoji }}</div>
          <div class="article-content">
            <h4 class="article-title text-ellipsis">{{ article.title }}</h4>
            <p class="article-summary text-ellipsis-2">{{ article.summary }}</p>
            <div class="article-meta">
              <span class="article-views">👁 {{ article.views }}</span>
              <span class="article-date">{{ article.date }}</span>
              <span class="article-tag">{{ article.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 专家在线问答 -->
    <div class="expert-section">
      <div class="section-title">
        <span class="title-bar"></span>
        专家在线问答
      </div>
      <div class="expert-list">
        <div v-for="expert in experts" :key="expert.id" class="expert-card">
          <div class="expert-avatar">{{ expert.avatar }}</div>
          <div class="expert-info">
            <h4>{{ expert.name }}</h4>
            <p class="expert-title">{{ expert.title }}</p>
            <p class="expert-field">擅长：{{ expert.field }}</p>
          </div>
          <button class="btn-ask" @click="askExpert(expert)">咨询</button>
        </div>
      </div>
    </div>

    <!-- 文章详情弹窗 -->
    <div class="modal-overlay" v-if="selectedArticle" @click.self="selectedArticle = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ selectedArticle.title }}</h3>
          <button class="modal-close" @click="selectedArticle = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="article-detail-meta">
            <span>{{ selectedArticle.category }}</span>
            <span>{{ selectedArticle.date }}</span>
            <span>阅读 {{ selectedArticle.views }}</span>
          </div>
          <div class="article-detail-content">
            <p>{{ selectedArticle.summary }}</p>
            <p style="margin-top: 16px; line-height: 1.8;">{{ selectedArticle.detail }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref('全部')
const selectedArticle = ref(null)

const categories = ['全部', '种植技术', '养殖技术', '病虫害防治', '政策解读']

const hotTags = ['春播技术', '玉米种植', '蔬菜管理', '节水灌溉', '病虫害防治', '农机使用', '大棚管理', '施肥技术']

const articles = [
  { id: 1, title: '春播玉米高产栽培技术要点', summary: '当前正值春播季节，科学播种是玉米高产的基础。本文从选种、整地、播种、管理等方面详细介绍。', detail: '一、品种选择。选择适合当地种植的优质高产品种，如郑单958、先玉335等。二、整地施肥。深耕25-30厘米，亩施有机肥2000公斤，复合肥50公斤。三、适时播种。地温稳定在10°C以上时播种，深度3-5厘米。四、合理密植。一般每亩4000-4500株。五、田间管理。及时间苗、定苗，注意防治病虫害。', views: '3.5万', date: '2026-05-05', category: '种植技术', emoji: '🌽' },
  { id: 2, title: '春季蔬菜病虫害综合防治技术', summary: '春季气温回升，蔬菜病虫害进入高发期。做好预防工作，保障蔬菜产量和品质。', detail: '一、农业防治。选用抗病品种，轮作倒茬，清洁田园。二、物理防治。安装防虫网，使用黄板诱杀蚜虫、白粉虱。三、生物防治。释放天敌昆虫，使用生物农药。四、化学防治。选用高效低毒农药，严格按说明使用。五、注意事项：严格遵守安全间隔期。', views: '2.9万', date: '2026-05-03', category: '病虫害防治', emoji: '🥬' },
  { id: 3, title: '小麦灌浆期管理技术', summary: '小麦进入灌浆期，是决定产量的关键时期。科学管理可提高千粒重，增加产量。', detail: '一、水分管理。保持土壤湿润，干旱时及时灌溉，注意防涝。二、叶面喷肥。喷施磷酸二氢钾，提高千粒重。三、病虫害防治。注意防治赤霉病、白粉病、蚜虫等。四、防干热风。可喷施调节剂，增强抗逆性。五、适时收获。蜡熟末期及时收获。', views: '2.2万', date: '2026-05-01', category: '种植技术', emoji: '🌾' },
  { id: 4, title: '2026年耕地地力保护补贴政策解读', summary: '详细介绍2026年耕地地力保护补贴的发放标准、申请流程和注意事项。', detail: '一、补贴对象。拥有耕地承包权的种地农民。二、补贴标准。每亩补贴约110元（具体以当地标准为准）。三、发放方式。通过"一卡通"直接发放到户。四、申请流程。农户申报→村组核实→乡镇审核→县级确认→公示→发放。五、注意事项。撂荒地不予补贴，改变用途的耕地不予补贴。', views: '5.3万', date: '2026-04-28', category: '政策解读', emoji: '📋' },
  { id: 5, title: '大棚西瓜春季管理技术', summary: '大棚西瓜春季管理是提高产量和品质的关键，科学管理可提前上市，增加收益。', detail: '一、温度管理。白天25-30°C，夜间不低于15°C。二、整枝压蔓。采用双蔓或三蔓整枝，及时压蔓。三、人工授粉。上午9-11时进行，标记授粉日期。四、水肥管理。膨果期加大水肥供应，增施钾肥。五、病虫害防治。注意防治炭疽病、白粉病、蚜虫等。', views: '2.4万', date: '2026-04-25', category: '种植技术', emoji: '🍉' },
  { id: 6, title: '春季蛋鸡饲养管理要点', summary: '春季气温变化大，蛋鸡饲养管理要做好保温与通风的平衡，保证产蛋率。', detail: '一、温度控制。鸡舍温度保持在18-22°C，避免昼夜温差过大。二、通风管理。在保温的同时保证通风，降低氨气浓度。三、调整饲料。适当增加蛋白质和维生素含量。四、光照管理。每天保持16小时光照时间。五、防疫消毒。定期消毒，预防呼吸道疾病。', views: '1.9万', date: '2026-04-22', category: '养殖技术', emoji: '🐔' }
]

const experts = [
  { id: 1, name: '王教授', avatar: '👨‍🔬', title: '河南农大教授', field: '小麦栽培、作物营养' },
  { id: 2, name: '李高级农艺师', avatar: '👩‍🌾', title: '省农科院', field: '蔬菜种植、设施农业' },
  { id: 3, name: '张兽医师', avatar: '👨‍⚕️', title: '市畜牧局', field: '畜禽疫病防控' }
]

const filteredArticles = computed(() => {
  if (activeCategory.value === '全部') return articles
  return articles.filter(a => a.category === activeCategory.value)
})

const searchTag = (tag) => {
  activeCategory.value = '全部'
}

const showArticleDetail = (article) => {
  selectedArticle.value = article
}

const askExpert = (expert) => {
  alert(`正在连接${expert.name}，请稍候...（演示功能）`)
}
</script>

<style scoped>
.agritech-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

/* 热门搜索 */
.hot-search {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 16px 20px;
  box-shadow: var(--shadow);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 6px 14px;
  background: var(--bg-gray);
  border-radius: 16px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.tag-item:hover {
  background: #E8F5E9;
  color: var(--primary-green);
}

/* 文章列表 */
.article-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 16px 20px;
  box-shadow: var(--shadow);
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-card {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: var(--transition);
}

.article-card:last-child {
  border-bottom: none;
}

.article-card:hover {
  opacity: 0.85;
}

.article-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF8E1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.article-content {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.article-summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.article-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-light);
}

.article-tag {
  padding: 2px 8px;
  background: #E8F5E9;
  color: var(--primary-green);
  border-radius: 10px;
  font-size: 11px;
}

/* 专家问答 */
.expert-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 16px 20px;
  box-shadow: var(--shadow);
}

.expert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expert-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--bg-gray);
  border-radius: var(--radius-sm);
}

.expert-avatar {
  font-size: 36px;
  flex-shrink: 0;
}

.expert-info {
  flex: 1;
  min-width: 0;
}

.expert-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.expert-title {
  font-size: 13px;
  color: var(--primary-green);
  margin: 2px 0;
}

.expert-field {
  font-size: 12px;
  color: var(--text-light);
}

.btn-ask {
  padding: 8px 20px;
  border-radius: 20px;
  background: var(--primary-green);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
  min-height: 44px;
  transition: var(--transition);
}

.btn-ask:hover {
  background: var(--primary-green-dark);
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
  max-width: 520px;
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
  flex: 1;
  margin-right: 12px;
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
  flex-shrink: 0;
}

.modal-body {
  padding: 20px;
}

.article-detail-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.article-detail-content {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
}

@media (max-width: 767px) {
  .article-icon {
    width: 56px;
    height: 56px;
    font-size: 28px;
  }

  .article-title {
    font-size: 15px;
  }
}
</style>
