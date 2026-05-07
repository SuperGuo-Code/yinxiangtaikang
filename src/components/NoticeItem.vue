<template>
  <div class="notice-item" :class="{ pinned: pinned }" @click="$emit('click')">
    <div class="notice-badge" v-if="pinned">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#E53935" stroke="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
    </div>
    <div class="notice-content">
      <h4 class="notice-title text-ellipsis">{{ title }}</h4>
      <p class="notice-summary text-ellipsis-2">{{ summary }}</p>
      <div class="notice-meta">
        <span class="notice-date">{{ date }}</span>
        <span class="notice-source">{{ source }}</span>
      </div>
    </div>
    <div class="notice-arrow">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  summary: { type: String, default: '' },
  date: { type: String, default: '' },
  source: { type: String, default: '' },
  pinned: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<style scoped>
.notice-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-white);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  border-left: 3px solid transparent;
}

.notice-item:hover {
  background: #FAFAFA;
}

.notice-item.pinned {
  border-left-color: var(--accent-yellow);
  background: #FFFDE7;
}

.notice-badge {
  flex-shrink: 0;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-content {
  flex: 1;
  min-width: 0;
}

.notice-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.notice-summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.notice-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-light);
}

.notice-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

@media (max-width: 767px) {
  .notice-item {
    padding: 14px 12px;
  }

  .notice-title {
    font-size: 15px;
  }

  .notice-summary {
    font-size: 13px;
  }
}
</style>
