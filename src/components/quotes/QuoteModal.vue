<script setup lang="ts">
import { nextTick } from 'vue'
import type { Quote } from '@/types/quote'
import gsap from 'gsap'

const props = defineProps<{
  quote: Quote | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggle-favorite', id: number, event: Event): void
  (e: 'copy', quote: Quote, event: Event): void
  (e: 'is-favorite', id: number): boolean
}>()

const onEnter = () => {
  nextTick(() => {
    gsap.fromTo('.modal-content', 
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power4.out" }
    )
  })
}

const getFontSize = (quoteText: string) => {
  const len = quoteText.length
  if (len > 120) return 'text-3xl md:text-5xl'
  return 'text-4xl md:text-7xl'
}
</script>

<template>
  <Transition name="fade" @enter="onEnter">
    <div v-if="quote" class="fixed inset-0 z-[120] flex items-center justify-center px-6">
      <div @click="emit('close')" class="absolute inset-0 bg-[#FDFDFB]/95 backdrop-blur-md"></div>
      <div class="modal-content relative max-w-5xl w-full text-center py-20">
        <button @click="emit('close')" class="absolute -top-10 right-0 group">
          <span class="text-[10px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">Close</span>
        </button>
        
        <blockquote 
          class="font-serif italic leading-[1.2] text-stone-900 mb-12"
          :class="getFontSize(quote.quote)"
        >
          "{{ quote.quote }}"
        </blockquote>
        
        <div class="flex flex-col items-center gap-8">
          <cite class="text-xs font-bold uppercase tracking-[0.4em] not-italic text-stone-400">
            — {{ quote.author }}
          </cite>
          <div class="flex items-center gap-6 mt-4">
            <button @click="emit('toggle-favorite', quote.id, $event)" class="flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="emit('is-favorite', quote.id) ? 'text-rose-500 fill-current' : 'text-stone-300'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span class="text-[9px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-900">{{ emit('is-favorite', quote.id) ? 'Saved' : 'Save' }}</span>
            </button>
            <button @click="emit('copy', quote, $event)" class="flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span class="text-[9px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-900">Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
