<template>
  <div class="irrigation-page">
    <!-- 顶部统计 -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-icon available">💧</div>
        <div class="stat-info">
          <span class="stat-value">{{ availableWells }}</span>
          <span class="stat-label">今日可预约</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon mine">📋</div>
        <div class="stat-info">
          <span class="stat-value">{{ myReservations.length }}</span>
          <span class="stat-label">我的预约</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon queue">👥</div>
        <div class="stat-info">
          <span class="stat-value">{{ totalQueue }}</span>
          <span class="stat-label">排队人数</span>
        </div>
      </div>
    </div>

    <!-- 机井列表 -->
    <div class="wells-section">
      <div class="section-title">
        <span class="title-bar"></span>
        机井预约
      </div>
      <div class="wells-list">
        <div
          v-for="well in wells"
          :key="well.id"
          class="well-card"
          :class="{ 'full': well.status === '已满', 'maintenance': well.status === '维护中' }"
        >
          <div class="well-header">
            <div class="well-title">
              <span class="well-icon">🚰</span>
              <span class="well-name">{{ well.name }}</span>
            </div>
            <span class="well-status" :class="well.status">{{ well.status }}</span>
          </div>
          <div class="well-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {{ well.location }}
          </div>
          <div class="well-slots">
            <div
              v-for="slot in well.slots"
              :key="slot.time"
              class="slot-item"
              :class="{ 'available': slot.available, 'booked': !slot.available }"
              @click="slot.available && openBooking(well, slot)"
            >
              <span class="slot-time">{{ slot.label }}</span>
              <span class="slot-status">{{ slot.available ? '可预约' : '已约满' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的预约 -->
    <div class="my-reservation-section" v-if="myReservations.length > 0">
      <div class="section-title">
        <span class="title-bar"></span>
        我的预约
      </div>
      <div class="reservation-list">
        <div
          v-for="res in myReservations"
          :key="res.id"
          class="reservation-card"
          :class="{ 'active': res.status === '进行中', 'completed': res.status === '已完成' }"
        >
          <div class="res-info">
            <div class="res-well">{{ res.wellName }}</div>
            <div class="res-time">{{ res.date }} {{ res.timeLabel }}</div>
          </div>
          <div class="res-status">{{ res.status }}</div>
          <button class="cancel-btn" v-if="res.status === '待使用'" @click="cancelReservation(res.id)">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 历史记录 -->
    <div class="history-section" v-if="historyReservations.length > 0">
      <div class="section-title">
        <span class="title-bar"></span>
        历史记录
      </div>
      <div class="history-list">
        <div
          v-for="res in historyReservations"
          :key="res.id"
          class="history-card"
        >
          <div class="history-info">
            <div class="history-well">{{ res.wellName }}</div>
            <div class="history-time">{{ res.date }} {{ res.timeLabel }}</div>
          </div>
          <span class="history-status" :class="res.status">{{ res.status }}</span>
        </div>
      </div>
    </div>

    <!-- 预约弹窗 -->
    <div class="modal-overlay" v-if="bookingWell" @click.self="bookingWell = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>确认预约</h3>
          <button class="modal-close" @click="bookingWell = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="booking-info">
            <div class="info-row">
              <span class="info-label">机井：</span>
              <span class="info-value">{{ bookingWell.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">位置：</span>
              <span class="info-value">{{ bookingWell.location }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">时段：</span>
              <span class="info-value">{{ bookingSlot?.label }} ({{ bookingSlot?.time }})</span>
            </div>
          </div>
          <div class="booking-notice">
            <p>⚠️ 预约须知：</p>
            <ul>
              <li>请提前10分钟到达机井位置</li>
              <li>如需取消，请提前2小时操作</li>
              <li>超时15分钟未到，预约自动取消</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="bookingWell = null">取消</button>
          <button class="btn-submit" @click="confirmBooking">确认预约</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 机井数据
const wells = ref([
  {
    id: 1,
    name: '1号机井',
    location: '村东头农田区',
    status: '可用',
    slots: [
      { time: '06:00-12:00', label: '上午', available: true },
      { time: '12:00-18:00', label: '下午', available: false },
      { time: '18:00-22:00', label: '晚上', available: true }
    ]
  },
  {
    id: 2,
    name: '2号机井',
    location: '村西头麦田区',
    status: '可用',
    slots: [
      { time: '06:00-12:00', label: '上午', available: false },
      { time: '12:00-18:00', label: '下午', available: true },
      { time: '18:00-22:00', label: '晚上', available: true }
    ]
  },
  {
    id: 3,
    name: '3号机井',
    location: '河南岸菜地区',
    status: '可用',
    slots: [
      { time: '06:00-12:00', label: '上午', available: true },
      { time: '12:00-18:00', label: '下午', available: true },
      { time: '18:00-22:00', label: '晚上', available: false }
    ]
  },
  {
    id: 4,
    name: '4号机井',
    location: '村北果园区',
    status: '已满',
    slots: [
      { time: '06:00-12:00', label: '上午', available: false },
      { time: '12:00-18:00', label: '下午', available: false },
      { time: '18:00-22:00', label: '晚上', available: false }
    ]
  },
  {
    id: 5,
    name: '5号机井',
    location: '村南大棚区',
    status: '维护中',
    slots: [
      { time: '06:00-12:00', label: '上午', available: false },
      { time: '12:00-18:00', label: '下午', available: false },
      { time: '18:00-22:00', label: '晚上', available: false }
    ]
  },
  {
    id: 6,
    name: '6号机井',
    location: '村中心广场旁',
    status: '可用',
    slots: [
      { time: '06:00-12:00', label: '上午', available: true },
      { time: '12:00-18:00', label: '下午', available: true },
      { time: '18:00-22:00', label: '晚上', available: true }
    ]
  }
])

// 我的预约数据
const myReservations = ref([
  {
    id: 1,
    wellId: 3,
    wellName: '3号机井',
    date: '今天',
    timeLabel: '下午',
    timeRange: '12:00-18:00',
    status: '进行中'
  },
  {
    id: 2,
    wellId: 1,
    wellName: '1号机井',
    date: '明天',
    timeLabel: '上午',
    timeRange: '06:00-12:00',
    status: '待使用'
  }
])

// 历史记录
const historyReservations = ref([
  {
    id: 3,
    wellId: 2,
    wellName: '2号机井',
    date: '2026-05-05',
    timeLabel: '上午',
    status: '已完成'
  },
  {
    id: 4,
    wellId: 1,
    wellName: '1号机井',
    date: '2024-12-08',
    timeLabel: '晚上',
    status: '已取消'
  }
])

// 预约弹窗状态
const bookingWell = ref(null)
const bookingSlot = ref(null)

// 计算属性
const availableWells = computed(() => {
  return wells.value.filter(w => w.status === '可用').length
})

const totalQueue = computed(() => {
  return wells.value.reduce((sum, well) => {
    return sum + well.slots.filter(s => !s.available).length
  }, 0)
})

// 方法
const openBooking = (well, slot) => {
  bookingWell.value = well
  bookingSlot.value = slot
}

const confirmBooking = () => {
  if (!bookingWell.value || !bookingSlot.value) return

  // 创建新预约
  const newReservation = {
    id: Date.now(),
    wellId: bookingWell.value.id,
    wellName: bookingWell.value.name,
    date: '明天',
    timeLabel: bookingSlot.value.label,
    timeRange: bookingSlot.value.time,
    status: '待使用'
  }

  myReservations.value.push(newReservation)

  // 更新机井状态
  const well = wells.value.find(w => w.id === bookingWell.value.id)
  const slot = well.slots.find(s => s.time === bookingSlot.value.time)
  if (slot) slot.available = false

  alert('预约成功！')
  bookingWell.value = null
  bookingSlot.value = null
}

const cancelReservation = (id) => {
  if (!confirm('确定要取消这个预约吗？')) return

  const index = myReservations.value.findIndex(r => r.id === id)
  if (index > -1) {
    const res = myReservations.value[index]

    // 恢复机井时段可用状态
    const well = wells.value.find(w => w.id === res.wellId)
    if (well) {
      const slot = well.slots.find(s => s.label === res.timeLabel)
      if (slot) slot.available = true
    }

    // 移到历史记录
    historyReservations.value.unshift({
      ...res,
      status: '已取消'
    })

    myReservations.value.splice(index, 1)
  }
}
</script>

<style scoped>
.irrigation-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 统计栏 */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-item {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.available {
  background: #E3F2FD;
}

.stat-icon.mine {
  background: #E8F5E9;
}

.stat-icon.queue {
  background: #FFF3E0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
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

/* 机井列表 */
.wells-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.wells-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.well-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 16px;
  transition: var(--transition);
}

.well-card:hover {
  border-color: var(--primary-green);
}

.well-card.full {
  opacity: 0.7;
  background: var(--bg-gray);
}

.well-card.maintenance {
  opacity: 0.6;
  background: #FFF3E0;
}

.well-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.well-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.well-icon {
  font-size: 20px;
}

.well-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.well-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.well-status.可用 {
  background: #E8F5E9;
  color: var(--primary-green);
}

.well-status.已满 {
  background: #FFEBEE;
  color: #E53935;
}

.well-status.维护中 {
  background: #FFF3E0;
  color: #F57C00;
}

.well-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.well-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.slot-item {
  padding: 12px 8px;
  border-radius: var(--radius-sm);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.slot-item.available {
  background: #E8F5E9;
  border: 1px solid var(--primary-green);
}

.slot-item.available:hover {
  background: var(--primary-green);
}

.slot-item.available:hover .slot-time,
.slot-item.available:hover .slot-status {
  color: #fff;
}

.slot-item.booked {
  background: var(--bg-gray);
  border: 1px solid var(--border-color);
  cursor: not-allowed;
}

.slot-time {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.slot-status {
  display: block;
  font-size: 12px;
}

.slot-item.available .slot-status {
  color: var(--primary-green);
}

.slot-item.booked .slot-status {
  color: var(--text-light);
}

/* 我的预约 */
.my-reservation-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.reservation-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reservation-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius-sm);
  border-left: 4px solid var(--primary-green);
  background: var(--bg-gray);
}

.reservation-card.active {
  border-left-color: var(--accent-yellow);
  background: #FFF8E1;
}

.res-info {
  flex: 1;
}

.res-well {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.res-time {
  font-size: 13px;
  color: var(--text-secondary);
}

.res-status {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  background: #E8F5E9;
  color: var(--primary-green);
}

.reservation-card.active .res-status {
  background: #FFF3E0;
  color: #F57C00;
}

.cancel-btn {
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  background: #FFEBEE;
  color: #E53935;
  font-size: 13px;
  font-weight: 500;
}

/* 历史记录 */
.history-section {
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-gray);
}

.history-well {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.history-time {
  font-size: 13px;
  color: var(--text-secondary);
}

.history-status {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.history-status.已完成 {
  background: #E8F5E9;
  color: var(--primary-green);
}

.history-status.已取消 {
  background: #FFEBEE;
  color: #E53935;
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
  padding: 20px;
}

.booking-info {
  background: var(--bg-gray);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  font-size: 15px;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: var(--text-light);
  flex-shrink: 0;
  width: 60px;
}

.info-value {
  color: var(--text-primary);
  flex: 1;
  font-weight: 500;
}

.booking-notice {
  font-size: 14px;
  color: var(--text-secondary);
}

.booking-notice p {
  font-weight: 600;
  margin-bottom: 8px;
}

.booking-notice ul {
  padding-left: 16px;
  list-style: disc;
}

.booking-notice li {
  margin-bottom: 4px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
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
  .stats-bar {
    gap: 8px;
  }

  .stat-item {
    padding: 12px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-label {
    font-size: 12px;
  }

  .wells-section,
  .my-reservation-section,
  .history-section {
    padding: 16px;
  }

  .well-slots {
    grid-template-columns: 1fr;
  }

  .slot-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
  }

  .slot-time {
    margin-bottom: 0;
  }

  .reservation-card {
    flex-wrap: wrap;
    gap: 8px;
  }

  .res-status {
    order: 3;
  }

  .cancel-btn {
    order: 4;
    margin-left: auto;
  }
}
</style>
