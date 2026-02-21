<script setup lang="ts">
import type { Quote } from '@/types/quote'

const props = defineProps<{
  show: boolean
  quotes: Quote[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggle-favorite', id: number, event: Event): void
  (e: 'open-quote', quote: Quote): void
}>()
</script>

<template>
  <Transition name="slide">
    <div v-if="show" class="fixed inset-0 z-[110] bg-[#FDFDFB] p-6 md:p-20 overflow-y-auto">
      <header class="max-w-6xl mx-auto flex justify-between items-center mb-20">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Personal Collection</span>
          <h2 class="text-3xl font-serif italic">Your Archive.</h2>
        </div>
        <button @click="emit('close')" class="group flex items-center gap-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors">Return</span>
          <div class="w-8 h-8 rounded-full border border-stone-100 flex items-center justify-center group-hover:border-stone-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </button>
      </header>

      <div class="max-w-6xl mx-auto">
        <div v-if="quotes.length === 0" class="h-[50vh] flex flex-col items-center justify-center text-stone-300 gap-6">
          <div class="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-[0.4em]">Archive is currently empty</span>
          <button @click="emit('close')" class="text-[9px] font-bold uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1">Begin Collecting</button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          <article 
            v-for="(item, index) in quotes" 
            :key="item.id"
            @click="emit('open-quote', item)"
            class="flex flex-col group cursor-pointer"
          >
            <div class="flex items-center justify-between mb-6">
              <span class="text-[9px] font-bold text-stone-300 tracking-widest uppercase">Saved Item {{ index + 1 }}</span>
              <button @click="emit('toggle-favorite', item.id, $event)" class="text-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <blockquote class="font-serif italic leading-[1.3] text-stone-800 text-xl group-hover:text-black transition-colors">"{{ item.quote }}"</blockquote>
            <cite class="mt-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 not-italic">— {{ item.author }}</cite>
          </article>
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
