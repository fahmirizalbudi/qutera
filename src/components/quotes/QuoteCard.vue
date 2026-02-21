<script setup lang="ts">
import type { Quote } from '@/types/quote'

const props = defineProps<{
  quote: Quote
  index: number
  isFavorite: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-favorite', id: number, event: Event): void
  (e: 'open', quote: Quote): void
  (e: 'copy', quote: Quote, event: Event): void
}>()

const getFontSize = (quoteText: string) => {
  const len = quoteText.length
  if (len > 120) return 'text-xl md:text-2xl'
  if (len > 80) return 'text-2xl md:text-3xl'
  return 'text-3xl md:text-4xl'
}
</script>

<template>
  <article 
    @click="emit('open', quote)"
    class="quote-tile flex flex-col group cursor-pointer"
  >
    <!-- Index & Favorite -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3 flex-grow">
        <span class="text-[10px] font-bold text-stone-300 font-sans tabular-nums tracking-tighter">
          {{ String(index + 1).padStart(3, '0') }}
        </span>
        <div class="h-[1px] flex-grow bg-stone-100 group-hover:bg-stone-200 transition-colors"></div>
      </div>
      <button 
        @click="emit('toggle-favorite', quote.id, $event)"
        class="ml-4 transition-all duration-300"
        :class="isFavorite ? 'text-rose-500 scale-110' : 'text-stone-200 hover:text-stone-400'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :fill="isFavorite ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-grow">
      <blockquote 
        class="font-serif leading-[1.35] text-stone-800 transition-colors duration-700 group-hover:text-black" 
        :class="getFontSize(quote.quote)"
      >
        "{{ quote.quote }}"
      </blockquote>
    </div>
    
    <!-- Metadata & Share -->
    <div class="mt-10 flex items-center justify-between">
      <cite class="text-[11px] font-bold uppercase not-italic text-stone-400 group-hover:text-stone-900 transition-colors duration-500 tracking-wider">
        — {{ quote.author }}
      </cite>
      <div class="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
        <button @click="emit('copy', quote, $event)" class="text-stone-300 hover:text-stone-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>
