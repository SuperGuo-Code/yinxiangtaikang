<template>
  <div class="product-card" @click="$emit('click')">
    <div class="product-image">
      <span class="product-emoji">{{ emoji }}</span>
    </div>
    <div class="product-info">
      <h4 class="product-name text-ellipsis">{{ name }}</h4>
      <p class="product-origin text-ellipsis">{{ origin }}</p>
      <div class="product-bottom">
        <span class="product-price">¥{{ price }}<small>/斤</small></span>
        <span class="product-seller">{{ seller }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, default: '农产品' },
  price: { type: [String, Number], default: '0' },
  origin: { type: String, default: '河南' },
  seller: { type: String, default: '' },
  emoji: { type: String, default: '🌾' }
})

defineEmits(['click'])
</script>

<style scoped>
.product-card {
  background: var(--bg-white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #E8F5E9 0%, #FFF8E1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-emoji {
  font-size: 56px;
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.product-origin {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 8px;
}

.product-bottom {
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

.product-seller {
  font-size: 12px;
  color: var(--text-light);
}

@media (max-width: 767px) {
  .product-card {
    width: 150px;
  }

  .product-emoji {
    font-size: 44px;
  }

  .product-name {
    font-size: 14px;
  }

  .product-price {
    font-size: 16px;
  }
}
</style>
