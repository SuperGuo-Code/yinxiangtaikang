<template>
  <div class="services-page">
    <!-- 服务卡片网格 -->
    <div class="service-grid">
      <div
        v-for="service in services"
        :key="service.id"
        class="service-card"
        @click="handleService(service)"
      >
        <div class="service-icon" :style="{ background: service.bg }">{{ service.icon }}</div>
        <div class="service-info">
          <h4 class="service-name">{{ service.name }}</h4>
          <p class="service-desc">{{ service.desc }}</p>
        </div>
        <div class="service-arrow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 常用电话 -->
    <div class="phone-section">
      <div class="section-title">
        <span class="title-bar"></span>
        常用电话
      </div>
      <div class="phone-list">
        <div v-for="phone in phones" :key="phone.name" class="phone-item">
          <div class="phone-info">
            <span class="phone-name">{{ phone.name }}</span>
            <span class="phone-number">{{ phone.number }}</span>
          </div>
          <a :href="'tel:' + phone.number" class="phone-call">拨打</a>
        </div>
      </div>
    </div>

    <!-- 服务提示弹窗 -->
    <div class="modal-overlay" v-if="showTip" @click.self="showTip = false">
      <div class="modal-content tip-modal">
        <div class="modal-header">
          <h3>{{ tipService?.name }}</h3>
          <button class="modal-close" @click="showTip = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="tip-icon">{{ tipService?.icon }}</div>
          <p class="tip-text">{{ tipService?.tip }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-ok" @click="showTip = false">知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showTip = ref(false)
const tipService = ref(null)

const services = [
  {
    id: 1,
    name: '在线问诊',
    icon: '🏥',
    desc: '远程视频问诊，足不出户看医生',
    bg: '#E8F5E9',
    tip: '在线问诊功能即将上线，届时您可以通过视频与医生面对面交流，获取专业的医疗建议。目前如需就医，请前往乡镇卫生院或县级医院。'
  },
  {
    id: 2,
    name: '社保查询',
    icon: '📋',
    desc: '查询养老保险、医疗保险缴费情况',
    bg: '#E3F2FD',
    tip: '社保查询功能即将上线，届时您可以直接查看个人社保缴费记录、余额和待遇发放情况。目前可拨打12333社保热线查询。'
  },
  {
    id: 3,
    name: '生活缴费',
    icon: '💡',
    desc: '电费、水费、燃气费在线缴纳',
    bg: '#FFF3E0',
    tip: '生活缴费功能即将上线，届时您可以直接在线缴纳电费、水费、燃气费等生活费用。目前可前往乡镇营业厅或通过支付宝、微信缴费。'
  },
  {
    id: 4,
    name: '快递查询',
    icon: '📦',
    desc: '查询快递物流信息',
    bg: '#F3E5F5',
    tip: '快递查询功能即将上线，届时您可以直接输入快递单号查询物流信息。目前可拨打快递公司客服电话查询。'
  },
  {
    id: 5,
    name: '法律援助',
    icon: '⚖️',
    desc: '免费法律咨询，维护合法权益',
    bg: '#FFEBEE',
    tip: '法律援助功能即将上线，届时您可以在线咨询法律问题。如需紧急法律援助，请拨打12348法律服务热线，或前往县法律援助中心。'
  },
  {
    id: 6,
    name: '就业信息',
    icon: '💼',
    desc: '查看本地招工信息，找工作更方便',
    bg: '#E0F7FA',
    tip: '就业信息功能即将上线，届时您可以浏览本地企业招工信息。目前可前往乡镇劳动保障所或县人才市场了解就业信息。'
  }
]

const phones = [
  { name: '村委会', number: '0371-2345678' },
  { name: '乡镇卫生院', number: '0371-2345679' },
  { name: '派出所', number: '0371-2345680' },
  { name: '社保热线', number: '12333' },
  { name: '法律服务', number: '12348' },
  { name: '农业服务热线', number: '12316' },
  { name: '消费者投诉', number: '12315' },
  { name: '急救电话', number: '120' }
]

const handleService = (service) => {
  tipService.value = service
  showTip.value = true
}
</script>

<style scoped>
.services-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 服务卡片网格 */
.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 24px 16px;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.service-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-bottom: 12px;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.service-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.service-arrow {
  position: absolute;
  top: 16px;
  right: 16px;
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

/* 常用电话 */
.phone-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 16px 20px;
  box-shadow: var(--shadow);
}

.phone-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.phone-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
}

.phone-item:last-child {
  border-bottom: none;
}

.phone-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.phone-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.phone-number {
  font-size: 14px;
  color: var(--primary-green);
  font-weight: 600;
}

.phone-call {
  padding: 8px 20px;
  background: var(--primary-green);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  min-height: 44px;
  display: flex;
  align-items: center;
  transition: var(--transition);
}

.phone-call:hover {
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
  max-width: 400px;
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
}

.modal-body {
  padding: 24px 20px;
  text-align: center;
}

.tip-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.tip-text {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  text-align: left;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.btn-ok {
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--primary-green);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

@media (max-width: 767px) {
  .service-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .service-card {
    padding: 20px 12px;
  }

  .service-icon {
    width: 56px;
    height: 56px;
    font-size: 26px;
  }

  .service-name {
    font-size: 15px;
  }

  .service-desc {
    font-size: 11px;
  }
}

@media (min-width: 768px) {
  .service-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
