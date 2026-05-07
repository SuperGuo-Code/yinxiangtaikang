<template>
  <div class="app-wrapper">
    <PcLayout v-if="isPC">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </PcLayout>
    <MobileLayout v-else>
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </MobileLayout>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import PcLayout from './components/PcLayout.vue'
import MobileLayout from './components/MobileLayout.vue'

const isPC = ref(window.innerWidth >= 768)

const handleResize = () => {
  isPC.value = window.innerWidth >= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
}
</style>
