<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Header from './components/layout/Header.vue'
import QuoteCard from './components/quotes/QuoteCard.vue'
import QuoteModal from './components/quotes/QuoteModal.vue'
import ArchiveOverlay from './components/overlays/ArchiveOverlay.vue'
import ManifestoOverlay from './components/overlays/ManifestoOverlay.vue'

import { useQuotes } from './composables/useQuotes'
import { useFavorites } from './composables/useFavorites'
import type { Quote } from './types/quote'

const { allQuotes, displayedQuotes, loading, loadingMore, loadAllQuotes, appendMoreQuotes } = useQuotes()
const { favorites, loadFavorites, toggleFavorite, isFavorite } = useFavorites()

const searchQuery = ref('')
const selectedQuote = ref<Quote | null>(null)
const showManifesto = ref(false)
const showArchive = ref(false)
const observerTarget = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const filteredQuotes = computed(() => {
  if (!searchQuery.value) return displayedQuotes.value
  const query = searchQuery.value.toLowerCase()
  return displayedQuotes.value.filter(q => 
    q.quote.toLowerCase().includes(query) || 
    q.author.toLowerCase().includes(query)
  )
})

const savedQuotes = computed(() => {
  return allQuotes.value.filter(q => favorites.value.includes(q.id))
})

const copyToClipboard = async (quote: Quote, event: Event) => {
  event.stopPropagation()
  const text = `"${quote.quote}" — ${quote.author}\n\nVia Qutera Archive`
  try {
    await navigator.clipboard.writeText(text)
    alert('Copied to clipboard')
  } catch (err) {
    console.error(err)
  }
}

const setupInfiniteScroll = () => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value && !loadingMore.value && !searchQuery.value) {
      appendMoreQuotes()
    }
  }, { threshold: 0.1, rootMargin: '200px' })

  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
}

onMounted(() => {
  loadFavorites()
  loadAllQuotes()
  setupInfiniteScroll()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="min-h-screen w-full bg-[#FDFDFB] text-[#121212] font-sans flex flex-col selection:bg-[#121212] selection:text-[#FDFDFB]">
    <Header 
      :favorites-count="favorites.length"
      @update:search="v => searchQuery = v"
      @show-manifesto="showManifesto = true"
      @show-archive="showArchive = true"
    />

    <main class="flex-grow w-full">
      <div class="max-w-6xl mx-auto px-6 pt-32 pb-12 md:pb-24 w-full">
        <div v-if="filteredQuotes.length === 0 && !loading" class="h-[40vh] flex flex-col items-center justify-center text-stone-300 gap-4">
          <span class="text-[10px] font-bold uppercase tracking-[0.4em]">No results found</span>
        </div>

        <div v-if="loading" class="h-[60vh] flex items-center justify-center">
          <div class="w-6 h-6 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
        </div>

        <div 
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 md:gap-y-32"
        >
          <QuoteCard 
            v-for="(item, index) in filteredQuotes" 
            :key="`${item.id}-${index}`"
            :quote="item"
            :index="index"
            :is-favorite="isFavorite(item.id)"
            @toggle-favorite="toggleFavorite"
            @open="q => selectedQuote = q"
            @copy="copyToClipboard"
          />
        </div>

        <div ref="observerTarget" class="w-full py-20 flex justify-center">
          <div v-if="loadingMore" class="flex gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>
    </main>

    <ArchiveOverlay 
      :show="showArchive"
      :quotes="savedQuotes"
      @close="showArchive = false"
      @toggle-favorite="toggleFavorite"
      @open-quote="q => selectedQuote = q"
    />

    <ManifestoOverlay 
      :show="showManifesto"
      @close="showManifesto = false"
    />

    <QuoteModal 
      :quote="selectedQuote"
      :is-favorite="selectedQuote ? isFavorite(selectedQuote.id) : false"
      @close="selectedQuote = null"
      @toggle-favorite="toggleFavorite"
      @copy="copyToClipboard"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,500;1,6..72,600&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #FDFDFB;
  -webkit-font-smoothing: antialiased;
}

.font-serif {
  font-family: 'Newsreader', serif;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #FDFDFB; }
::-webkit-scrollbar-thumb { background: #E5E5E0; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #D4D4D0; }

::selection { background: #121212; color: #FDFDFB; }
</style>
