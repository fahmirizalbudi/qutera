<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Transition name="slide">
    <div v-if="show" class="fixed inset-0 z-[130] bg-stone-900 text-stone-100 p-10 md:p-20 overflow-y-auto">
      <button @click="emit('close')" class="fixed top-10 right-10 group z-[140]">
        <span class="text-[10px] font-bold uppercase tracking-widest text-stone-500 group-hover:text-white transition-colors">Return</span>
      </button>
      
      <div class="max-w-3xl mx-auto py-20">
        <span class="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-12 block">The Protocol</span>
        <h2 class="text-5xl md:text-8xl font-serif italic mb-20 leading-none">The Art of Curated Wisdom.</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 text-sm leading-relaxed text-stone-400 font-sans">
          <div class="space-y-6">
            <p>Qutera is an infinite archive dedicated to the preservation of human thought. In an age of digital noise, we prioritize the singular, the profound, and the eternal.</p>
            <p>Our editorial protocol ensures that every perspective shared within this space serves as a portal to deeper understanding.</p>
          </div>
          <div class="space-y-6">
            <p>We believe in the power of the printed word reborn for the screen. Every quote is a tile in an endless mosaic of collective intelligence.</p>
            <p>Explore. Save. Reflect. The archive is infinite, just as our capacity for growth.</p>
          </div>
        </div>

        <div class="mt-32 pt-12 border-t border-stone-800 flex justify-between items-center">
          <div class="flex items-center gap-4">
            <img src="@/assets/logo.svg" alt="Qutera Logo" class="w-6 h-6 invert" />
            <span class="text-[9px] font-bold uppercase tracking-widest">Qutera Editorial</span>
          </div>
          <span class="text-[9px] font-bold uppercase tracking-widest text-stone-600">v1.0.2 Archive Mode</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1); }
.slide-enter-from { transform: translateY(100%); }
.slide-leave-to { transform: translateY(100%); }
</style>
