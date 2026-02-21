<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  favoritesCount: number
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'show-manifesto'): void
  (e: 'show-archive'): void
}>()

const searchQuery = ref('')

const onSearch = () => {
  emit('update:search', searchQuery.value)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <header class="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
    <div class="pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-full px-4 md:px-8 py-2.5 flex items-center gap-6 md:gap-10 transition-all duration-500 hover:shadow-[0_8px_48_rgba(0,0,0,0.08)] hover:bg-white/80">
      <!-- Logo Section -->
      <div class="flex items-center group cursor-pointer" @click="scrollToTop">
        <img src="@/assets/logo.svg" alt="Qutera Logo" class="w-7 h-7 transition-transform duration-700 group-hover:rotate-[360deg]" />
      </div>
      
      <!-- Search Field -->
      <div class="flex items-center relative">
        <input 
          v-model="searchQuery"
          @input="onSearch"
          type="text" 
          placeholder="Search archive..."
          class="bg-transparent text-[10px] font-bold uppercase tracking-widest border-none focus:ring-0 w-24 md:w-32 placeholder:text-stone-300"
        />
      </div>

      <!-- Minimal Nav -->
      <nav class="hidden lg:flex items-center gap-8 border-l border-stone-200/50 pl-8">
        <button @click="emit('show-manifesto')" class="text-[9px] font-bold uppercase text-stone-400 hover:text-stone-900 transition-colors tracking-widest">Manifesto</button>
        <button @click="emit('show-archive')" class="text-[9px] font-bold uppercase text-stone-400 hover:text-stone-900 transition-colors tracking-widest flex items-center gap-2">
          Archive
          <span v-if="favoritesCount" class="px-1.5 py-0.5 bg-stone-900 text-white rounded-full text-[8px] leading-none tracking-normal">{{ favoritesCount }}</span>
        </button>
      </nav>

      <!-- Status -->
      <div class="flex items-center gap-3 border-l border-stone-200/50 pl-6 md:pl-8">
        <div class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <span class="hidden sm:inline text-[9px] font-bold uppercase text-stone-500 tracking-widest">Live</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
input:focus { outline: none; }
</style>
